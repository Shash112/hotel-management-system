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
    const categoryId = searchParams.get('categoryId')
    const isActive = searchParams.get('isActive')

    const where: any = {}
    if (categoryId) where.categoryId = categoryId
    if (isActive !== null) where.isActive = isActive === 'true'

    const menuItems = await prisma.menuItem.findMany({
      where,
      include: {
        category: true,
        taxes: true
      },
      orderBy: [
        { category: { sortOrder: 'asc' } },
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json(menuItems)
  } catch (error) {
    console.error('Error fetching menu items:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'CASHIER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, price, categoryId, isVeg, imageUrl, taxes } = body

    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Name, price, and category are required' },
        { status: 400 }
      )
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 400 }
      )
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        categoryId,
        isVeg: isVeg || false,
        imageUrl,
        taxes: {
          create: taxes || []
        }
      },
      include: {
        category: true,
        taxes: true
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'MENU_ITEM_CREATED',
        details: {
          menuItemName: name,
          price,
          categoryId,
          isVeg
        }
      }
    })

    return NextResponse.json(menuItem, { status: 201 })
  } catch (error) {
    console.error('Error creating menu item:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
