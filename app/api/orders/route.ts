import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const tableId = searchParams.get('tableId')

    const where: any = {}
    if (status) where.status = status
    if (tableId) where.tableId = tableId

    const orders = await prisma.order.findMany({
      where,
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
        payments: true,
        _count: {
          select: { items: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { tableId, items, notes } = body

    if (!tableId || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Table ID and items are required' },
        { status: 400 }
      )
    }

    // Calculate totals
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

    // Create order with items
    const order = await prisma.order.create({
      data: {
        tableId,
        userId: session.user.id,
        totalAmount,
        notes,
        items: {
          create: orderItems
        }
      },
      include: {
        table: true,
        user: {
          select: { id: true, name: true, role: true }
        },
        items: {
          include: {
            menuItem: true
          }
        }
      }
    })

    // Update table status
    await prisma.table.update({
      where: { id: tableId },
      data: { isOccupied: true }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        orderId: order.id,
        action: 'ORDER_CREATED',
        details: {
          tableId,
          itemCount: items.length,
          totalAmount
        }
      }
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
