import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        table: true,
        user: {
          select: { id: true, name: true, role: true }
        },
        items: {
          include: {
            menuItem: true
          }
        },
        payments: true
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status, items, notes, discountAmount } = body

    const existingOrder = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true }
    })

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Update order status
    const updateData: any = {}
    if (status !== undefined) updateData.status = status
    if (notes !== undefined) updateData.notes = notes
    if (discountAmount !== undefined) updateData.discountAmount = discountAmount

    // If items are being updated, recalculate totals
    if (items) {
      let totalAmount = 0
      const orderItems = []

      for (const item of items) {
        const menuItem = await prisma.menuItem.findUnique({
          where: { id: item.menuItemId }
        })

        if (!menuItem) {
          return NextResponse.json(
            { error: `Menu item ${item.menuItemId} not found` },
            { status: 400 }
          )
        }

        const itemTotal = menuItem.price * item.quantity
        totalAmount += itemTotal

        orderItems.push({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          unitPrice: menuItem.price,
          totalPrice: itemTotal,
          notes: item.notes
        })
      }

      updateData.totalAmount = totalAmount
      updateData.finalAmount = totalAmount - (discountAmount || 0)
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
      include: {
        table: true,
        user: {
          select: { id: true, name: true, role: true }
        },
        items: {
          include: {
            menuItem: true
          }
        },
        payments: true
      }
    })

    // If items were updated, replace them
    if (items) {
      await prisma.orderItem.deleteMany({
        where: { orderId: params.id }
      })

      await prisma.orderItem.createMany({
        data: orderItems.map(item => ({
          ...item,
          orderId: params.id
        }))
      })
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        orderId: params.id,
        action: 'ORDER_UPDATED',
        details: {
          changes: updateData,
          itemsUpdated: !!items
        }
      }
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admin can delete orders
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { table: true }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Free up the table
    await prisma.table.update({
      where: { id: order.tableId },
      data: { isOccupied: false }
    })

    await prisma.order.delete({
      where: { id: params.id }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        orderId: params.id,
        action: 'ORDER_DELETED',
        details: {
          tableId: order.tableId,
          totalAmount: order.totalAmount
        }
      }
    })

    return NextResponse.json({ message: 'Order deleted successfully' })
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
