'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  CheckCircle, 
  Clock, 
  Search, 
  Filter, 
  ChefHat,
  Users,
  Timer,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

interface CompletedOrderItem {
  id: string
  quantity: number
  unitPrice: number
  totalPrice: number
  status: string
  notes?: string
  createdAt: string
  updatedAt: string
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
    user: {
      name: string
    }
  }
}

export default function KitchenCompleted() {
  const [completedItems, setCompletedItems] = useState<CompletedOrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [timeFilter, setTimeFilter] = useState('today')

  useEffect(() => {
    fetchCompletedItems()
  }, [])

  const fetchCompletedItems = async () => {
    try {
      // In a real app, this would filter for completed items
      const response = await fetch('/api/order-items')
      if (response.ok) {
        const data = await response.json()
        // Filter for completed items
        const completed = data.filter((item: any) => item.status === 'COMPLETED')
        setCompletedItems(completed)
      }
    } catch (error) {
      toast.error('Failed to load completed orders')
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = completedItems.filter(item => {
    const matchesSearch = item.menuItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.order.table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.order.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const itemDate = new Date(item.updatedAt)
    const now = new Date()
    
    let matchesTime = true
    switch (timeFilter) {
      case 'today':
        matchesTime = itemDate.toDateString() === now.toDateString()
        break
      case 'yesterday':
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        matchesTime = itemDate.toDateString() === yesterday.toDateString()
        break
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        matchesTime = itemDate >= weekAgo
        break
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        matchesTime = itemDate >= monthAgo
        break
    }
    
    return matchesSearch && matchesTime
  })

  const getCompletionStats = () => {
    const today = new Date()
    const todayItems = completedItems.filter(item => 
      new Date(item.updatedAt).toDateString() === today.toDateString()
    )
    
    const stats = {
      today: todayItems.length,
      total: completedItems.length,
      totalRevenue: completedItems.reduce((sum, item) => sum + item.totalPrice, 0),
      todayRevenue: todayItems.reduce((sum, item) => sum + item.totalPrice, 0),
      avgTime: calculateAverageCompletionTime()
    }
    
    return stats
  }

  const calculateAverageCompletionTime = () => {
    if (completedItems.length === 0) return 0
    
    const totalTime = completedItems.reduce((sum, item) => {
      const created = new Date(item.createdAt)
      const completed = new Date(item.updatedAt)
      const diffInMinutes = (completed.getTime() - created.getTime()) / (1000 * 60)
      return sum + diffInMinutes
    }, 0)
    
    return Math.round(totalTime / completedItems.length)
  }

  const getCompletionTime = (createdAt: string, updatedAt: string) => {
    const created = new Date(createdAt)
    const completed = new Date(updatedAt)
    const diffInMinutes = Math.floor((completed.getTime() - created.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`
    } else {
      const hours = Math.floor(diffInMinutes / 60)
      const minutes = diffInMinutes % 60
      return `${hours}h ${minutes}m`
    }
  }

  const stats = getCompletionStats()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Completed Orders</h1>
          <p className="text-muted-foreground">Recently completed order items</p>
        </div>
        <Button onClick={fetchCompletedItems} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.today}</p>
                <p className="text-sm text-gray-500">Completed Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-500">Total Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <ChefHat className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹{stats.todayRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Today's Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <Timer className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.avgTime}m</p>
                <p className="text-sm text-gray-500">Avg Prep Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-full">
                <CheckCircle className="h-4 w-4 text-gray-600" />
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
                  placeholder="Search by item name, table, or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Completed Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Completed Orders ({filteredItems.length})
          </CardTitle>
          <CardDescription>
            Recently completed order items ready for service
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Prep Time</TableHead>
                <TableHead>Completed At</TableHead>
                <TableHead>Waiter</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {item.menuItem.name}
                        <Badge variant="outline" className="text-xs">
                          {item.menuItem.isVeg ? 'Veg' : 'Non-Veg'}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">{item.menuItem.description}</div>
                      {item.notes && (
                        <div className="text-xs text-yellow-600 mt-1">
                          📝 {item.notes}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.order.table.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.quantity}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Timer className="h-3 w-3 text-gray-400" />
                      {getCompletionTime(item.createdAt, item.updatedAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(item.updatedAt).toLocaleTimeString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {item.order.user.name}
                  </TableCell>
                  <TableCell className="font-medium">
                    ₹{item.totalPrice}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Completions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Completions</CardTitle>
          <CardDescription>
            Latest completed items (last 10)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredItems.slice(0, 10).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">{item.menuItem.name}</div>
                    <div className="text-sm text-gray-500">
                      Table {item.order.table.name} • Qty: {item.quantity}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">₹{item.totalPrice}</div>
                  <div className="text-xs text-gray-500">
                    {getCompletionTime(item.createdAt, item.updatedAt)} prep time
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
