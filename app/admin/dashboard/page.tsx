'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  const [users, setUsers] = useState<User[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [systemConfigs, setSystemConfigs] = useState<SystemConfig[]>([])
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [isMenuItemDialogOpen, setIsMenuItemDialogOpen] = useState(false)
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'WAITER'
  })
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    price: '',
    categoryId: '',
    isVeg: false
  })
  const [newConfig, setNewConfig] = useState({
    key: '',
    value: '',
    description: ''
  })

  useEffect(() => {
    fetchUsers()
    fetchMenuItems()
    fetchOrders()
    fetchSystemConfigs()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      toast.error('Failed to fetch users')
    }
  }

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu-items')
      const data = await response.json()
      setMenuItems(data)
    } catch (error) {
      toast.error('Failed to fetch menu items')
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      toast.error('Failed to fetch orders')
    }
  }

  const fetchSystemConfigs = async () => {
    try {
      const response = await fetch('/api/admin/system-configs')
      const data = await response.json()
      setSystemConfigs(data)
    } catch (error) {
      toast.error('Failed to fetch system configs')
    }
  }

  const createUser = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })

      if (response.ok) {
        toast.success('User created successfully')
        setIsUserDialogOpen(false)
        setNewUser({ name: '', email: '', password: '', role: 'WAITER' })
        fetchUsers()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create user')
      }
    } catch (error) {
      toast.error('Failed to create user')
    }
  }

  const createMenuItem = async () => {
    try {
      const response = await fetch('/api/menu-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMenuItem)
      })

      if (response.ok) {
        toast.success('Menu item created successfully')
        setIsMenuItemDialogOpen(false)
        setNewMenuItem({ name: '', price: '', categoryId: '', isVeg: false })
        fetchMenuItems()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create menu item')
      }
    } catch (error) {
      toast.error('Failed to create menu item')
    }
  }

  const updateSystemConfig = async (configId: string, value: string) => {
    try {
      const response = await fetch(`/api/admin/system-configs/${configId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
      })

      if (response.ok) {
        toast.success('Configuration updated successfully')
        fetchSystemConfigs()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update configuration')
      }
    } catch (error) {
      toast.error('Failed to update configuration')
    }
  }

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      ADMIN: 'bg-red-100 text-red-800',
      CASHIER: 'bg-blue-100 text-blue-800',
      WAITER: 'bg-green-100 text-green-800',
      COOK: 'bg-orange-100 text-orange-800'
    }
    
    return (
      <Badge className={roleConfig[role as keyof typeof roleConfig] || 'bg-gray-100 text-gray-800'}>
        {role}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PREPARING: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    }
    
    return (
      <Badge className={statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    )
  }

  // Calculate stats
  const totalUsers = users.length
  const activeUsers = users.filter(user => user.isActive).length
  const totalMenuItems = menuItems.length
  const activeMenuItems = menuItems.filter(item => item.isActive).length
  const totalOrders = orders.length
  const completedOrders = orders.filter(order => order.status === 'COMPLETED').length
  const totalRevenue = orders
    .filter(order => order.status === 'COMPLETED')
    .reduce((sum, order) => sum + order.totalAmount, 0)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session?.user?.name}</p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={fetchUsers} variant="outline">
            🔄 Refresh Users
          </Button>
          <Button onClick={fetchOrders} variant="outline">
            🔄 Refresh Orders
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Total Users</p>
                <p className="text-2xl font-bold text-blue-900">{totalUsers}</p>
                <p className="text-xs text-blue-600">{activeUsers} active</p>
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
                <p className="text-2xl font-bold text-green-900">{totalMenuItems}</p>
                <p className="text-xs text-green-600">{activeMenuItems} active</p>
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
                <p className="text-2xl font-bold text-orange-900">{totalOrders}</p>
                <p className="text-xs text-orange-600">{completedOrders} completed</p>
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
                <p className="text-2xl font-bold text-purple-900">{formatCurrency(totalRevenue)}</p>
                <p className="text-xs text-purple-600">All time</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="menu">Menu Items</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage system users and their roles</CardDescription>
                </div>
                <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>Add User</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>
                        Create a new user account for the system
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="userName">Name</Label>
                        <Input
                          id="userName"
                          value={newUser.name}
                          onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter user name"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="userEmail">Email</Label>
                        <Input
                          id="userEmail"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter email address"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="userPassword">Password</Label>
                        <Input
                          id="userPassword"
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Enter password"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="userRole">Role</Label>
                        <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="CASHIER">Cashier</SelectItem>
                            <SelectItem value="WAITER">Waiter</SelectItem>
                            <SelectItem value="COOK">Cook</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={createUser}>
                          Create User
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? 'default' : 'secondary'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(new Date(user.createdAt))}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menu" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Menu Management</CardTitle>
                  <CardDescription>Manage menu items and pricing</CardDescription>
                </div>
                <Dialog open={isMenuItemDialogOpen} onOpenChange={setIsMenuItemDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>Add Menu Item</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Menu Item</DialogTitle>
                      <DialogDescription>
                        Add a new item to the menu
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="itemName">Name</Label>
                        <Input
                          id="itemName"
                          value={newMenuItem.name}
                          onChange={(e) => setNewMenuItem(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter item name"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="itemPrice">Price</Label>
                        <Input
                          id="itemPrice"
                          type="number"
                          value={newMenuItem.price}
                          onChange={(e) => setNewMenuItem(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="Enter price"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="itemCategory">Category</Label>
                        <Select value={newMenuItem.categoryId} onValueChange={(value) => setNewMenuItem(prev => ({ ...prev, categoryId: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Appetizers</SelectItem>
                            <SelectItem value="2">Main Course</SelectItem>
                            <SelectItem value="3">Desserts</SelectItem>
                            <SelectItem value="4">Beverages</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isVeg"
                          checked={newMenuItem.isVeg}
                          onChange={(e) => setNewMenuItem(prev => ({ ...prev, isVeg: e.target.checked }))}
                        />
                        <Label htmlFor="isVeg">Vegetarian</Label>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsMenuItemDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={createMenuItem}>
                          Add Item
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category.name}</TableCell>
                      <TableCell>{formatCurrency(item.price)}</TableCell>
                      <TableCell>
                        <Badge variant={item.isVeg ? 'default' : 'secondary'}>
                          {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.isActive ? 'default' : 'secondary'}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>View and manage all orders</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.slice(0, 10).map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">{order.id.slice(-8)}</TableCell>
                      <TableCell>Table {order.table.number}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(order.totalAmount)}</TableCell>
                      <TableCell>{formatDate(new Date(order.createdAt))}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Manage system settings and configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemConfigs.map((config) => (
                  <div key={config.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{config.key}</h3>
                      <p className="text-sm text-muted-foreground">{config.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        value={config.value}
                        onChange={(e) => updateSystemConfig(config.id, e.target.value)}
                        className="w-48"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
