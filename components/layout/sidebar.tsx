'use client'

import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogoutButton } from '@/components/auth/logout-button'
import { Badge } from '@/components/ui/badge'
import { 
  Home, 
  Users, 
  ChefHat, 
  CreditCard, 
  Settings, 
  Menu,
  ShoppingCart,
  Receipt,
  BarChart3,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  if (!session) {
    return null
  }

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return {
          color: 'bg-red-500',
          label: 'Administrator',
          icon: <Settings className="h-5 w-5" />
        }
      case 'WAITER':
        return {
          color: 'bg-green-500',
          label: 'Waiter',
          icon: <Users className="h-5 w-5" />
        }
      case 'CASHIER':
        return {
          color: 'bg-blue-500',
          label: 'Cashier',
          icon: <CreditCard className="h-5 w-5" />
        }
      case 'COOK':
        return {
          color: 'bg-orange-500',
          label: 'Kitchen Staff',
          icon: <ChefHat className="h-5 w-5" />
        }
      default:
        return {
          color: 'bg-gray-500',
          label: 'User',
          icon: <Users className="h-5 w-5" />
        }
    }
  }

  const getNavigationItems = (role: string) => {
    const baseItems = [
      {
        href: '/dashboard',
        label: 'Dashboard',
        icon: <Home className="h-5 w-5" />,
        description: 'Overview and quick access'
      }
    ]

    switch (role) {
      case 'ADMIN':
        return [
          ...baseItems,
          {
            href: '/admin/dashboard',
            label: 'Admin Panel',
            icon: <Settings className="h-5 w-5" />,
            description: 'Manage users and system'
          },
          {
            href: '/admin/users',
            label: 'User Management',
            icon: <Users className="h-5 w-5" />,
            description: 'Add, edit, and manage users'
          },
          {
            href: '/admin/menu',
            label: 'Menu Management',
            icon: <Menu className="h-5 w-5" />,
            description: 'Manage menu items and categories'
          },
          {
            href: '/admin/settings',
            label: 'System Settings',
            icon: <BarChart3 className="h-5 w-5" />,
            description: 'Configure system settings'
          }
        ]
      case 'WAITER':
        return [
          ...baseItems,
          {
            href: '/waiter/dashboard',
            label: 'Take Orders',
            icon: <ShoppingCart className="h-5 w-5" />,
            description: 'Create and manage orders'
          },
          {
            href: '/waiter/tables',
            label: 'Table Management',
            icon: <Users className="h-5 w-5" />,
            description: 'View table status and assignments'
          },
          {
            href: '/waiter/orders',
            label: 'My Orders',
            icon: <Receipt className="h-5 w-5" />,
            description: 'View orders I created'
          }
        ]
      case 'CASHIER':
        return [
          ...baseItems,
          {
            href: '/cashier/dashboard',
            label: 'Payment Center',
            icon: <CreditCard className="h-5 w-5" />,
            description: 'Process payments and bills'
          },
          {
            href: '/cashier/bills',
            label: 'Bill Generation',
            icon: <Receipt className="h-5 w-5" />,
            description: 'Generate GST-compliant bills'
          },
          {
            href: '/cashier/reports',
            label: 'Daily Reports',
            icon: <BarChart3 className="h-5 w-5" />,
            description: 'View sales and payment reports'
          }
        ]
      case 'COOK':
        return [
          ...baseItems,
          {
            href: '/kitchen/dashboard',
            label: 'Kitchen Display',
            icon: <ChefHat className="h-5 w-5" />,
            description: 'View and update order status'
          },
          {
            href: '/kitchen/orders',
            label: 'Active Orders',
            icon: <ShoppingCart className="h-5 w-5" />,
            description: 'Current orders to prepare'
          },
          {
            href: '/kitchen/completed',
            label: 'Completed Orders',
            icon: <Receipt className="h-5 w-5" />,
            description: 'Recently completed orders'
          }
        ]
      default:
        return baseItems
    }
  }

  const roleInfo = getRoleInfo(session.user.role)
  const navigationItems = getNavigationItems(session.user.role)

  return (
    <div className="flex flex-col h-screen w-80 bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">Hotel Management</h1>
            <p className="text-sm text-gray-500">System Dashboard</p>
          </div>
        </div>
        
        {/* User Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${roleInfo.color} rounded-full flex items-center justify-center text-white`}>
              {roleInfo.icon}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{session.user.name}</p>
              <p className="text-xs text-gray-500">{session.user.email}</p>
              <Badge variant="secondary" className="mt-1 text-xs">
                {roleInfo.label}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Navigation
          </h3>
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? 'default' : 'ghost'}
                className={cn(
                  "w-full justify-start h-auto p-4",
                  pathname === item.href 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-gray-100'
                )}
              >
                <div className="flex items-start space-x-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    pathname === item.href 
                      ? 'bg-primary-foreground/20' 
                      : 'bg-gray-100'
                  )}>
                    {item.icon}
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs opacity-70 mt-1">{item.description}</p>
                  </div>
                </div>
              </Button>
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <LogoutButton />
      </div>
    </div>
  )
}
