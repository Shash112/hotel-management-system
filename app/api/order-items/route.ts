import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orderItems = await prisma.orderItem.findMany({
      include: {
        menuItem: true,
        order: {
          include: {
            table: true,
            user: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(orderItems)
  } catch (error) {
    console.error('Error fetching order items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order items' },
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
    const { orderId, menuItemId, quantity, unitPrice, notes } = body

    if (!orderId || !menuItemId || !quantity || !unitPrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const totalPrice = quantity * unitPrice

    const orderItem = await prisma.orderItem.create({
      data: {
        orderId,
        menuItemId,
        quantity,
        unitPrice,
        totalPrice,
        notes: notes || '',
        status: 'PENDING'
      },
      include: {
        menuItem: true,
        order: {
          include: {
            table: true
          }
        }
      }
    })

    // Update order total
    await prisma.order.update({
      where: { id: orderId },
      data: {
        totalAmount: {
          increment: totalPrice
        }
      }
    })

    return NextResponse.json(orderItem, { status: 201 })
  } catch (error) {
    console.error('Error creating order item:', error)
    return NextResponse.json(
      { error: 'Failed to create order item' },
      { status: 500 }
    )
  }
}
