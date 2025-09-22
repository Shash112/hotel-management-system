'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, ShoppingCart, Clock, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Table {
  id: string
  number: string
  capacity: number
  isOccupied: boolean
}

interface MenuItem {
  id: string
  name: string
  price: number
  category: {
    name: string
  }
}

interface Order {
  id: string
  table: Table
  status: string
  totalAmount: number
  createdAt: string
  items: Array<{
    id: string
    quantity: number
    menuItem: MenuItem
  }>
}

export default function WaiterDashboard() {
  const { data: session } = useSession()
  const [tables, setTables] = useState<Table[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedTable, setSelectedTable] = useState<string>('')
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
  const [cart, setCart] = useState<Array<{ menuItem: MenuItem; quantity: number; notes?: string }>>([])

  useEffect(() => {
    fetchTables()
    fetchMenuItems()
    fetchOrders()
  }, [])

  const fetchTables = async () => {
    try {
      const response = await fetch('/api/tables')
      const data = await response.json()
      setTables(data)
    } catch (error) {
      toast.error('Failed to fetch tables')
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

  const addToCart = (menuItem: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.menuItem.id === menuItem.id)
      if (existing) {
        return prev.map(item =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prev, { menuItem, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (menuItemId: string) => {
    setCart(prev => prev.filter(item => item.menuItem.id !== menuItemId))
  }

  const updateCartQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId)
      return
    }
    
    setCart(prev =>
      prev.map(item =>
        item.menuItem.id === menuItemId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const createOrder = async () => {
    if (!selectedTable || cart.length === 0) {
      toast.error('Please select a table and add items to cart')
      return
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: selectedTable,
          items: cart.map(item => ({
            menuItemId: item.menuItem.id,
            quantity: item.quantity,
            notes: item.notes
          }))
        })
      })

      if (response.ok) {
        toast.success('Order created successfully')
        setIsOrderDialogOpen(false)
        setCart([])
        setSelectedTable('')
        fetchOrders()
        fetchTables() // Refresh table status
      } else {
        toast.error('Failed to create order')
      }
    } catch (error) {
      toast.error('Failed to create order')
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: 'secondary' as const, icon: Clock, label: 'Pending' },
      PREPARING: { variant: 'default' as const, icon: Clock, label: 'Preparing' },
      COMPLETED: { variant: 'default' as const, icon: CheckCircle, label: 'Completed' },
      CANCELLED: { variant: 'destructive' as const, icon: XCircle, label: 'Cancelled' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const totalCartAmount = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Order Management</h1>
          <p className="text-muted-foreground">Take orders and manage restaurant tables</p>
        </div>
        
        <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
              <DialogDescription>
                Select a table and add menu items to create an order
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Menu Items */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Menu Items</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {menuItems.map((item) => (
                    <Card key={item.id} className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.category.name}</p>
                          <p className="text-sm font-semibold">{formatCurrency(item.price)}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addToCart(item)}
                          className="ml-2"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Cart */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Cart</h3>
                  <Badge variant="outline">{cart.length} items</Badge>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <Card key={item.menuItem.id} className="p-3">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.menuItem.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(item.menuItem.price)} × {item.quantity}
                          </p>
                          <p className="text-sm font-semibold">
                            {formatCurrency(item.menuItem.price * item.quantity)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateCartQuantity(item.menuItem.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateCartQuantity(item.menuItem.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeFromCart(item.menuItem.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {cart.length > 0 && (
                  <Card className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <Label htmlFor="table">Select Table</Label>
                      <Select value={selectedTable} onValueChange={setSelectedTable}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Choose table" />
                        </SelectTrigger>
                        <SelectContent>
                          {tables.filter(table => !table.isOccupied).map((table) => (
                            <SelectItem key={table.id} value={table.id}>
                              Table {table.number} ({table.capacity} seats)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total:</span>
                      <span>{formatCurrency(totalCartAmount)}</span>
                    </div>
                    
                    <Button 
                      onClick={createOrder}
                      className="w-full mt-4"
                      disabled={!selectedTable}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Create Order
                    </Button>
                  </Card>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tables Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Tables Status</CardTitle>
          <CardDescription>Current status of all tables</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {tables.map((table) => (
              <Card 
                key={table.id} 
                className={`p-4 text-center ${
                  table.isOccupied ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                }`}
              >
                <h3 className="font-semibold">Table {table.number}</h3>
                <p className="text-sm text-muted-foreground">{table.capacity} seats</p>
                <Badge variant={table.isOccupied ? 'destructive' : 'default'} className="mt-2">
                  {table.isOccupied ? 'Occupied' : 'Available'}
                </Badge>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Orders you have created</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">{order.id.slice(-8)}</TableCell>
                  <TableCell>Table {order.table.number}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{order.items.length} items</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(order.totalAmount)}</TableCell>
                  <TableCell>{formatDate(new Date(order.createdAt))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
