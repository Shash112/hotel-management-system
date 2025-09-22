'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Filter, Eye, Edit, Clock, CheckCircle, AlertCircle, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'

interface Order {
  id: string
  tableId: string
  table: {
    name: string
  }
  status: string
  totalAmount: number
  finalAmount: number
  createdAt: string
  updatedAt: string
  orderItems: {
    id: string
    quantity: number
    unitPrice: number
    totalPrice: number
    status: string
    menuItem: {
      name: string
    }
  }[]
}

export default function WaiterOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        // Filter orders for current waiter (you might want to add user context)
        setOrders(data)
      }
    } catch (error) {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: <Clock className="h-4 w-4" />,
          label: 'Pending'
        }
      case 'PREPARING':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: <AlertCircle className="h-4 w-4" />,
          label: 'Preparing'
        }
      case 'COMPLETED':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle className="h-4 w-4" />,
          label: 'Completed'
        }
      case 'CANCELLED':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <AlertCircle className="h-4 w-4" />,
          label: 'Cancelled'
        }
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: <Clock className="h-4 w-4" />,
          label: status
        }
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'PENDING').length,
      preparing: orders.filter(o => o.status === 'PREPARING').length,
      completed: orders.filter(o => o.status === 'COMPLETED').length,
      totalRevenue: orders.reduce((sum, order) => sum + order.finalAmount, 0)
    }
    return stats
  }

  const stats = getOrderStats()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">My Orders</h1>
          <p className="text-muted-foreground">View and manage orders you created</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-full">
                <DollarSign className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-500">Total Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>

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
                <AlertCircle className="h-4 w-4 text-blue-600" />
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
              <div className="p-2 bg-purple-100 rounded-full">
                <DollarSign className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by table name or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PREPARING">Preparing</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Orders ({filteredOrders.length})
          </CardTitle>
          <CardDescription>
            Orders created by you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status)
                const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0)
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      {order.id.slice(-8)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.table.name}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusInfo.color}>
                        {statusInfo.icon}
                        <span className="ml-1">{statusInfo.label}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{totalItems}</span>
                        <span className="text-sm text-gray-500">items</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">₹{order.finalAmount}</div>
                        {order.totalAmount !== order.finalAmount && (
                          <div className="text-sm text-gray-500">
                            <span className="line-through">₹{order.totalAmount}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {order.status === 'PENDING' && (
                          <Button size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
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
