import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Create default admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@hotel.com',
      name: 'System Administrator',
      password: adminPassword,
      role: 'ADMIN',
      isActive: true
    }
  })

  console.log('Created admin user:', admin.email)

  // Create sample users
  const waiterPassword = await bcrypt.hash('waiter123', 12)
  const waiter = await prisma.user.create({
    data: {
      email: 'waiter@hotel.com',
      name: 'John Waiter',
      password: waiterPassword,
      role: 'WAITER',
      isActive: true
    }
  })

  const cashierPassword = await bcrypt.hash('cashier123', 12)
  const cashier = await prisma.user.create({
    data: {
      email: 'cashier@hotel.com',
      name: 'Jane Cashier',
      password: cashierPassword,
      role: 'CASHIER',
      isActive: true
    }
  })

  const cookPassword = await bcrypt.hash('cook123', 12)
  const cook = await prisma.user.create({
    data: {
      email: 'cook@hotel.com',
      name: 'Chef Mike',
      password: cookPassword,
      role: 'COOK',
      isActive: true
    }
  })

  console.log('Created sample users')

  // Create categories
  const appetizerCategory = await prisma.category.create({
    data: {
      name: 'Appetizers',
      description: 'Starters and appetizers',
      sortOrder: 1
    }
  })

  const mainCategory = await prisma.category.create({
    data: {
      name: 'Main Course',
      description: 'Main dishes and entrees',
      sortOrder: 2
    }
  })

  const dessertCategory = await prisma.category.create({
    data: {
      name: 'Desserts',
      description: 'Sweet treats and desserts',
      sortOrder: 3
    }
  })

  const beverageCategory = await prisma.category.create({
    data: {
      name: 'Beverages',
      description: 'Drinks and beverages',
      sortOrder: 4
    }
  })

  console.log('Created categories')

  // Create sample menu items
  await prisma.menuItem.create({
    data: {
      name: 'Chicken Wings',
      description: 'Spicy buffalo chicken wings',
      price: 299,
      categoryId: appetizerCategory.id,
      isVeg: false,
      sortOrder: 1,
      taxes: {
        create: [
          { taxType: 'CGST', taxRate: 9.0 },
          { taxType: 'SGST', taxRate: 9.0 }
        ]
      }
    }
  })

  await prisma.menuItem.create({
    data: {
      name: 'Veg Spring Rolls',
      description: 'Crispy vegetable spring rolls',
      price: 199,
      categoryId: appetizerCategory.id,
      isVeg: true,
      sortOrder: 2,
      taxes: {
        create: [
          { taxType: 'CGST', taxRate: 9.0 },
          { taxType: 'SGST', taxRate: 9.0 }
        ]
      }
    }
  })

  await prisma.menuItem.create({
    data: {
      name: 'Butter Chicken',
      description: 'Creamy tomato-based chicken curry',
      price: 399,
      categoryId: mainCategory.id,
      isVeg: false,
      sortOrder: 1,
      taxes: {
        create: [
          { taxType: 'CGST', taxRate: 9.0 },
          { taxType: 'SGST', taxRate: 9.0 }
        ]
      }
    }
  })

  await prisma.menuItem.create({
    data: {
      name: 'Paneer Butter Masala',
      description: 'Cottage cheese in creamy tomato gravy',
      price: 349,
      categoryId: mainCategory.id,
      isVeg: true,
      sortOrder: 2,
      taxes: {
        create: [
          { taxType: 'CGST', taxRate: 9.0 },
          { taxType: 'SGST', taxRate: 9.0 }
        ]
      }
    }
  })

  await prisma.menuItem.create({
    data: {
      name: 'Gulab Jamun',
      description: 'Sweet milk dumplings in rose syrup',
      price: 149,
      categoryId: dessertCategory.id,
      isVeg: true,
      sortOrder: 1,
      taxes: {
        create: [
          { taxType: 'CGST', taxRate: 9.0 },
          { taxType: 'SGST', taxRate: 9.0 }
        ]
      }
    }
  })

  await prisma.menuItem.create({
    data: {
      name: 'Fresh Lime Soda',
      description: 'Refreshing lime soda',
      price: 89,
      categoryId: beverageCategory.id,
      isVeg: true,
      sortOrder: 1,
      taxes: {
        create: [
          { taxType: 'CGST', taxRate: 9.0 },
          { taxType: 'SGST', taxRate: 9.0 }
        ]
      }
    }
  })

  console.log('Created menu items')

  // Create tables
  await prisma.table.create({
    data: {
      number: '1',
      capacity: 4,
      isOccupied: false
    }
  })

  await prisma.table.create({
    data: {
      number: '2',
      capacity: 6,
      isOccupied: false
    }
  })

  await prisma.table.create({
    data: {
      number: '3',
      capacity: 2,
      isOccupied: false
    }
  })

  await prisma.table.create({
    data: {
      number: '4',
      capacity: 8,
      isOccupied: false
    }
  })

  await prisma.table.create({
    data: {
      number: '5',
      capacity: 4,
      isOccupied: false
    }
  })

  console.log('Created tables')

  // Create system configurations
  await prisma.systemConfig.create({
    data: {
      key: 'HOTEL_NAME',
      value: 'Hotel Management System',
      description: 'Name of the hotel/restaurant'
    }
  })

  await prisma.systemConfig.create({
    data: {
      key: 'HOTEL_ADDRESS',
      value: '123 Restaurant Street, Food City, FC 123456',
      description: 'Hotel/restaurant address'
    }
  })

  await prisma.systemConfig.create({
    data: {
      key: 'GST_NUMBER',
      value: '12ABCDE1234F1Z5',
      description: 'GST registration number'
    }
  })

  await prisma.systemConfig.create({
    data: {
      key: 'DEFAULT_CGST_RATE',
      value: '9.0',
      description: 'Default CGST rate percentage'
    }
  })

  await prisma.systemConfig.create({
    data: {
      key: 'DEFAULT_SGST_RATE',
      value: '9.0',
      description: 'Default SGST rate percentage'
    }
  })

  await prisma.systemConfig.create({
    data: {
      key: 'DEFAULT_IGST_RATE',
      value: '18.0',
      description: 'Default IGST rate percentage'
    }
  })

  await prisma.systemConfig.create({
    data: {
      key: 'SERVICE_CHARGE_RATE',
      value: '0.0',
      description: 'Service charge rate percentage'
    }
  })

  console.log('Created system configurations')

  // Create default theme
  await prisma.theme.create({
    data: {
      name: 'Default Theme',
      isActive: true,
      primaryColor: 'hsl(221.2 83.2% 53.3%)',
      secondaryColor: 'hsl(210 40% 98%)',
      accentColor: 'hsl(210 40% 96%)',
      backgroundColor: 'hsl(0 0% 100%)',
      textColor: 'hsl(222.2 84% 4.9%)',
      borderRadius: '0.5rem',
      fontFamily: 'Inter, system-ui, sans-serif'
    }
  })

  console.log('Created default theme')
  console.log('Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
