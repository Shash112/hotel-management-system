import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status, notes } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    const orderItem = await prisma.orderItem.findUnique({
      where: { id: params.id },
      include: {
        order: {
          include: {
            table: true,
            items: true
          }
        }
      }
    })

    if (!orderItem) {
      return NextResponse.json({ error: 'Order item not found' }, { status: 404 })
    }

    // Update the order item
    const updatedOrderItem = await prisma.orderItem.update({
      where: { id: params.id },
      data: {
        status,
        ...(notes && { notes })
      },
      include: {
        order: true,
        menuItem: true
      }
    })

    // Check if all items in the order are completed
    const allItemsCompleted = orderItem.order.items.every(item => 
      item.id === params.id ? status === 'COMPLETED' : item.status === 'COMPLETED'
    )

    // If all items are completed, update the order status
    if (allItemsCompleted && orderItem.order.status !== 'COMPLETED') {
      await prisma.order.update({
        where: { id: orderItem.order.id },
        data: { status: 'COMPLETED' }
      })

      // Free up the table
      await prisma.table.update({
        where: { id: orderItem.order.tableId },
        data: { isOccupied: false }
      })
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        orderId: orderItem.order.id,
        action: 'ORDER_ITEM_STATUS_UPDATED',
        details: {
          orderItemId: params.id,
          menuItemName: orderItem.menuItem.name,
          oldStatus: orderItem.status,
          newStatus: status,
          allItemsCompleted
        }
      }
    })

    return NextResponse.json(updatedOrderItem)
  } catch (error) {
    console.error('Error updating order item:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
