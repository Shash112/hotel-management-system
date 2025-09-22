'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Settings, Users, Menu, BarChart3, DollarSign, ShoppingCart, ChefHat } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { formatCurrency, formatDate } from '@/lib/utils'

interface User {
  id: string
  name: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
}

interface MenuItem {
  id: string
  name: string
  price: number
  isActive: boolean
  category: {
    name: string
  }
}

interface Order {
  id: string
  table: {
    number: string
  }
  status: string
  totalAmount: number
  createdAt: string
}

interface SystemConfig {
  id: string
  key: string
  value: string
  description: string
}

export default function AdminDashboard() {
  const { data: session } = useSession()

  // Mock data for now - will be replaced with real API calls later
  const stats = {
    totalUsers: 12,
    activeUsers: 10,
    totalMenuItems: 45,
    activeMenuItems: 42,
    totalOrders: 156,
    completedOrders: 142,
    totalRevenue: 45600
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session?.user?.name}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Total Users</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalUsers}</p>
                <p className="text-xs text-blue-600">{stats.activeUsers} active</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Menu Items</p>
                <p className="text-2xl font-bold text-green-900">{stats.totalMenuItems}</p>
                <p className="text-xs text-green-600">{stats.activeMenuItems} active</p>
              </div>
              <Menu className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-800">Total Orders</p>
                <p className="text-2xl font-bold text-orange-900">{stats.totalOrders}</p>
                <p className="text-xs text-orange-600">{stats.completedOrders} completed</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-800">Total Revenue</p>
                <p className="text-2xl font-bold text-purple-900">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-xs text-purple-600">All time</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Menu className="mr-2 h-4 w-4" />
              Manage Menu
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              System Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Database</span>
              <Badge className="bg-green-100 text-green-800">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Authentication</span>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>API Services</span>
              <Badge className="bg-green-100 text-green-800">Running</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest system events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm">System initialized successfully</span>
              <span className="text-xs text-muted-foreground">Just now</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm">Admin dashboard loaded</span>
              <span className="text-xs text-muted-foreground">Just now</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Database connection established</span>
              <span className="text-xs text-muted-foreground">Just now</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
