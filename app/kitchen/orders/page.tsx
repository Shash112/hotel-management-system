'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  ChefHat, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  Pause,
  Users,
  Timer
} from 'lucide-react'
import toast from 'react-hot-toast'

interface OrderItem {
  id: string
  quantity: number
  unitPrice: number
  totalPrice: number
  status: string
  notes?: string
  createdAt: string
  menuItem: {
    name: string
    description: string
    isVeg: boolean
  }
  order: {
    id: string
    table: {
      name: string
    }
    createdAt: string
  }
}

export default function KitchenOrders() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('PENDING')

  useEffect(() => {
    fetchOrderItems()
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchOrderItems, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchOrderItems = async () => {
    try {
      const response = await fetch('/api/order-items')
      if (response.ok) {
        const data = await response.json()
        setOrderItems(data)
      }
    } catch (error) {
      toast.error('Failed to load order items')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderItemStatus = async (itemId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/order-items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        toast.success(`Order item marked as ${newStatus.toLowerCase()}`)
        fetchOrderItems()
      } else {
        toast.error('Failed to update order item status')
      }
    } catch (error) {
      toast.error('Failed to update order item status')
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: <Clock className="h-4 w-4" />,
          label: 'Pending',
          bgColor: 'bg-yellow-50'
        }
      case 'PREPARING':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: <ChefHat className="h-4 w-4" />,
          label: 'Preparing',
          bgColor: 'bg-blue-50'
        }
      case 'COMPLETED':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle className="h-4 w-4" />,
          label: 'Completed',
          bgColor: 'bg-green-50'
        }
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: <AlertCircle className="h-4 w-4" />,
          label: status,
          bgColor: 'bg-gray-50'
        }
    }
  }

  const filteredItems = orderItems.filter(item => {
    if (statusFilter === 'all') return true
    return item.status === statusFilter
  })

  const getOrderStats = () => {
    const stats = {
      pending: orderItems.filter(item => item.status === 'PENDING').length,
      preparing: orderItems.filter(item => item.status === 'PREPARING').length,
      completed: orderItems.filter(item => item.status === 'COMPLETED').length,
      total: orderItems.length
    }
    return stats
  }

  const getTimeElapsed = (createdAt: string) => {
    const now = new Date()
    const created = new Date(createdAt)
    const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else {
      const hours = Math.floor(diffInMinutes / 60)
      const minutes = diffInMinutes % 60
      return `${hours}h ${minutes}m ago`
    }
  }

  const stats = getOrderStats()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Active Orders</h1>
          <p className="text-muted-foreground">Current orders to prepare</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PREPARING">Preparing</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <ChefHat className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.preparing}</p>
                <p className="text-sm text-gray-500">Preparing</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-full">
                <Users className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-500">Total Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const statusInfo = getStatusInfo(item.status)
          return (
            <Card key={item.id} className={`${statusInfo.bgColor} hover:shadow-lg transition-shadow`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={statusInfo.color}>
                      {statusInfo.icon}
                      <span className="ml-1">{statusInfo.label}</span>
                    </Badge>
                    <Badge variant="outline">
                      {item.menuItem.isVeg ? 'Veg' : 'Non-Veg'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Timer className="h-3 w-3" />
                    {getTimeElapsed(item.createdAt)}
                  </div>
                </div>
                <CardTitle className="text-lg">{item.menuItem.name}</CardTitle>
                <CardDescription>
                  Table {item.order.table.name} • Qty: {item.quantity}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    {item.menuItem.description}
                  </div>
                  
                  {item.notes && (
                    <div className="p-2 bg-yellow-100 rounded text-sm">
                      <strong>Notes:</strong> {item.notes}
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Order #{item.order.id.slice(-6)}</span>
                    <span className="text-gray-500">
                      ₹{item.totalPrice}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {item.status === 'PENDING' && (
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => updateOrderItemStatus(item.id, 'PREPARING')}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Start Preparing
                      </Button>
                    )}
                    
                    {item.status === 'PREPARING' && (
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => updateOrderItemStatus(item.id, 'COMPLETED')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark Complete
                      </Button>
                    )}
                    
                    {item.status === 'COMPLETED' && (
                      <div className="flex-1 text-center text-sm text-green-600 font-medium">
                        ✅ Ready for Service
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Orders Table View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            All Order Items
          </CardTitle>
          <CardDescription>
            Complete list of all order items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => {
                const statusInfo = getStatusInfo(item.status)
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.menuItem.name}</div>
                        <div className="text-sm text-gray-500">{item.menuItem.description}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.order.table.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.quantity}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusInfo.color}>
                        {statusInfo.icon}
                        <span className="ml-1">{statusInfo.label}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {getTimeElapsed(item.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {item.status === 'PENDING' && (
                          <Button 
                            size="sm"
                            onClick={() => updateOrderItemStatus(item.id, 'PREPARING')}
                          >
                            Start
                          </Button>
                        )}
                        
                        {item.status === 'PREPARING' && (
                          <Button 
                            size="sm"
                            onClick={() => updateOrderItemStatus(item.id, 'COMPLETED')}
                          >
                            Complete
                          </Button>
                        )}
                        
                        {item.status === 'COMPLETED' && (
                          <span className="text-sm text-green-600 font-medium">Done</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
