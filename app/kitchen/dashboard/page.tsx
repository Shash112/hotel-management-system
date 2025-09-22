'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle, AlertCircle, ChefHat, Timer } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useOrderUpdates } from '@/hooks/use-socket'

interface OrderItem {
  id: string
  quantity: number
  unitPrice: number
  totalPrice: number
  status: string
  notes?: string
  menuItem: {
    id: string
    name: string
    isVeg: boolean
  }
}

interface Order {
  id: string
  table: {
    id: string
    number: string
  }
  status: string
  totalAmount: number
  createdAt: string
  items: OrderItem[]
}

export default function KitchenDashboard() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'preparing' | 'completed'>('all')
  const [soundEnabled, setSoundEnabled] = useState(true)
  
  // Use real-time updates
  const realTimeOrders = useOrderUpdates()

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    if (realTimeOrders.length > 0) {
      setOrders(realTimeOrders)
    }
  }, [realTimeOrders])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      toast.error('Failed to fetch orders')
    }
  }

  const updateOrderItemStatus = async (orderItemId: string, status: string) => {
    try {
      const response = await fetch(`/api/order-items/${orderItemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        toast.success('Order item status updated')
        
        // Play notification sound
        if (soundEnabled && status === 'COMPLETED') {
          playNotificationSound()
        }
        
        fetchOrders() // Refresh orders
      } else {
        toast.error('Failed to update order item status')
      }
    } catch (error) {
      toast.error('Failed to update order item status')
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        toast.success('Order status updated')
        fetchOrders()
      } else {
        toast.error('Failed to update order status')
      }
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  const playNotificationSound = () => {
    // Create a simple notification sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { 
        variant: 'secondary' as const, 
        icon: Clock, 
        label: 'Pending',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-300'
      },
      PREPARING: { 
        variant: 'default' as const, 
        icon: ChefHat, 
        label: 'Preparing',
        className: 'bg-blue-100 text-blue-800 border-blue-300'
      },
      COMPLETED: { 
        variant: 'default' as const, 
        icon: CheckCircle, 
        label: 'Ready',
        className: 'bg-green-100 text-green-800 border-green-300'
      },
      CANCELLED: { 
        variant: 'destructive' as const, 
        icon: AlertCircle, 
        label: 'Cancelled',
        className: 'bg-red-100 text-red-800 border-red-300'
      }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
    const Icon = config.icon

    return (
      <Badge className={`${config.className} flex items-center gap-1 border`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getOrderItemStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { 
        variant: 'secondary' as const, 
        icon: Clock, 
        label: 'Pending',
        className: 'bg-yellow-50 text-yellow-700 border-yellow-200'
      },
      PREPARING: { 
        variant: 'default' as const, 
        icon: ChefHat, 
        label: 'Cooking',
        className: 'bg-blue-50 text-blue-700 border-blue-200'
      },
      COMPLETED: { 
        variant: 'default' as const, 
        icon: CheckCircle, 
        label: 'Ready',
        className: 'bg-green-50 text-green-700 border-green-200'
      }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
    const Icon = config.icon

    return (
      <Badge className={`${config.className} flex items-center gap-1 border text-xs`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getTimeElapsed = (createdAt: string) => {
    const now = new Date()
    const created = new Date(createdAt)
    const diffMs = now.getTime() - created.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    
    const diffHours = Math.floor(diffMins / 60)
    return `${diffHours}h ${diffMins % 60}m ago`
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.status === filter.toUpperCase()
  })

  const pendingOrders = orders.filter(order => order.status === 'PENDING').length
  const preparingOrders = orders.filter(order => order.status === 'PREPARING').length
  const completedOrders = orders.filter(order => order.status === 'COMPLETED').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <ChefHat className="h-8 w-8 text-orange-600" />
                Kitchen Display System
              </h1>
              <p className="text-muted-foreground">Welcome, {session?.user?.name}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? '🔊' : '🔇'} Sound
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchOrders}
              >
                🔄 Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-800">Pending Orders</p>
                  <p className="text-2xl font-bold text-yellow-900">{pendingOrders}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">Preparing</p>
                  <p className="text-2xl font-bold text-blue-900">{preparingOrders}</p>
                </div>
                <ChefHat className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Ready</p>
                  <p className="text-2xl font-bold text-green-900">{completedOrders}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Total Orders</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
                <Timer className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'all', label: 'All Orders' },
            { key: 'pending', label: 'Pending' },
            { key: 'preparing', label: 'Preparing' },
            { key: 'completed', label: 'Ready' }
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant={filter === key ? 'default' : 'outline'}
              onClick={() => setFilter(key as any)}
              size="sm"
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="kitchen-order">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Table {order.table.number}
                    </CardTitle>
                    <CardDescription>
                      Order #{order.id.slice(-8)}
                    </CardDescription>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Total: {formatCurrency(order.totalAmount)}</span>
                  <span className="flex items-center gap-1">
                    <Timer className="h-3 w-3" />
                    {getTimeElapsed(order.createdAt)}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.menuItem.name}</span>
                          <span className="text-sm text-gray-500">×{item.quantity}</span>
                          {item.menuItem.isVeg && (
                            <span className="text-green-600 text-xs">🟢 Veg</span>
                          )}
                        </div>
                        {item.notes && (
                          <p className="text-xs text-gray-600 italic">Note: {item.notes}</p>
                        )}
                        <p className="text-sm font-medium">{formatCurrency(item.totalPrice)}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        {getOrderItemStatusBadge(item.status)}
                        {item.status === 'PENDING' && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderItemStatus(item.id, 'PREPARING')}
                            className="text-xs"
                          >
                            Start
                          </Button>
                        )}
                        {item.status === 'PREPARING' && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderItemStatus(item.id, 'COMPLETED')}
                            className="text-xs bg-green-600 hover:bg-green-700"
                          >
                            Ready
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  {order.status === 'PENDING' && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                      className="flex-1"
                    >
                      Start Order
                    </Button>
                  )}
                  {order.status === 'PREPARING' && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Mark Complete
                    </Button>
                  )}
                  {order.status === 'COMPLETED' && (
                    <div className="flex-1 text-center text-sm text-green-600 font-medium">
                      ✅ Order Ready for Pickup
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <ChefHat className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">
                {filter === 'all' 
                  ? 'No orders have been placed yet.' 
                  : `No ${filter} orders at the moment.`
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
