'use client'

import { useSession } from 'next-auth/react'
import { Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Header() {
  const { data: session } = useSession()

  if (!session) {
    return null
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page Title and Breadcrumb */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {getPageTitle()}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {getPageDescription()}
          </p>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search orders, customers..."
              className="pl-10 w-64"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>

          {/* Quick Actions based on role */}
          <div className="flex items-center space-x-2">
            {getQuickActions(session.user.role)}
          </div>
        </div>
      </div>
    </header>
  )
}

function getPageTitle() {
  if (typeof window === 'undefined') return 'Dashboard'
  
  const path = window.location.pathname
  switch (path) {
    case '/dashboard':
      return 'Dashboard'
    case '/admin/dashboard':
      return 'Admin Panel'
    case '/waiter/dashboard':
      return 'Order Management'
    case '/cashier/dashboard':
      return 'Payment Center'
    case '/kitchen/dashboard':
      return 'Kitchen Display'
    default:
      return 'Dashboard'
  }
}

function getPageDescription() {
  if (typeof window === 'undefined') return 'Welcome to Hotel Management System'
  
  const path = window.location.pathname
  switch (path) {
    case '/dashboard':
      return 'Welcome to Hotel Management System'
    case '/admin/dashboard':
      return 'Manage users, menu items, and system settings'
    case '/waiter/dashboard':
      return 'Take orders and manage restaurant tables'
    case '/cashier/dashboard':
      return 'Process payments and generate bills'
    case '/kitchen/dashboard':
      return 'View orders and update preparation status'
    default:
      return 'Welcome to Hotel Management System'
  }
}

function getQuickActions(role: string) {
  switch (role) {
    case 'ADMIN':
      return null // Removed Add User and System Settings buttons
    case 'WAITER':
      return (
        <>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            New Order
          </Button>
          <Button size="sm" variant="outline">
            View Tables
          </Button>
        </>
      )
    case 'CASHIER':
      return (
        <>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
            Process Payment
          </Button>
          <Button size="sm" variant="outline">
            Generate Bill
          </Button>
        </>
      )
    case 'COOK':
      return (
        <>
          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
            Update Status
          </Button>
          <Button size="sm" variant="outline">
            View Orders
          </Button>
        </>
      )
    default:
      return null
  }
}
