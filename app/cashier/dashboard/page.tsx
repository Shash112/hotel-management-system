'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Receipt, CreditCard, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { formatCurrency, formatDate } from '@/lib/utils'
import { BillGenerator } from '@/components/bill/bill-generator'

interface Order {
  id: string
  table: {
    id: string
    number: string
  }
  status: string
  totalAmount: number
  finalAmount: number
  createdAt: string
  items: Array<{
    id: string
    quantity: number
    menuItem: {
      name: string
    }
  }>
  payments: Array<{
    id: string
    amount: number
    method: string
    status: string
  }>
}

export default function CashierDashboard() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'paid'>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [paymentData, setPaymentData] = useState({
    method: '',
    amount: 0,
    transactionId: ''
  })

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      toast.error('Failed to fetch orders')
    }
  }

  const processPayment = async () => {
    if (!selectedOrder || !paymentData.method || paymentData.amount <= 0) {
      toast.error('Please fill in all payment details')
      return
    }

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          amount: paymentData.amount,
          method: paymentData.method,
          transactionId: paymentData.transactionId || null
        })
      })

      if (response.ok) {
        toast.success('Payment processed successfully')
        setIsPaymentDialogOpen(false)
        setPaymentData({ method: '', amount: 0, transactionId: '' })
        fetchOrders()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to process payment')
      }
    } catch (error) {
      toast.error('Failed to process payment')
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { 
        variant: 'secondary' as const, 
        icon: Clock, 
        label: 'Pending',
        className: 'bg-yellow-100 text-yellow-800'
      },
      PREPARING: { 
        variant: 'default' as const, 
        icon: Clock, 
        label: 'Preparing',
        className: 'bg-blue-100 text-blue-800'
      },
      COMPLETED: { 
        variant: 'default' as const, 
        icon: CheckCircle, 
        label: 'Ready',
        className: 'bg-green-100 text-green-800'
      },
      CANCELLED: { 
        variant: 'destructive' as const, 
        icon: AlertCircle, 
        label: 'Cancelled',
        className: 'bg-red-100 text-red-800'
      }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
    const Icon = config.icon

    return (
      <Badge className={`${config.className} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getPaymentStatusBadge = (order: Order) => {
    const totalPaid = order.payments
      .filter(payment => payment.status === 'COMPLETED')
      .reduce((sum, payment) => sum + payment.amount, 0)

    if (totalPaid >= order.finalAmount) {
      return <Badge className="bg-green-100 text-green-800">Paid</Badge>
    } else if (totalPaid > 0) {
      return <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800">Unpaid</Badge>
    }
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    if (filter === 'pending') return order.status === 'COMPLETED'
    if (filter === 'completed') return order.status === 'COMPLETED'
    if (filter === 'paid') {
      const totalPaid = order.payments
        .filter(payment => payment.status === 'COMPLETED')
        .reduce((sum, payment) => sum + payment.amount, 0)
      return totalPaid >= order.finalAmount
    }
    return true
  })

  const pendingOrders = orders.filter(order => order.status === 'COMPLETED').length
  const unpaidOrders = orders.filter(order => {
    const totalPaid = order.payments
      .filter(payment => payment.status === 'COMPLETED')
      .reduce((sum, payment) => sum + payment.amount, 0)
    return totalPaid < order.finalAmount
  }).length
  const totalRevenue = orders
    .filter(order => order.payments.some(payment => payment.status === 'COMPLETED'))
    .reduce((sum, order) => {
      const paid = order.payments
        .filter(payment => payment.status === 'COMPLETED')
        .reduce((sum, payment) => sum + payment.amount, 0)
      return sum + paid
    }, 0)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Cashier Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session?.user?.name}</p>
        </div>
        
        <Button onClick={fetchOrders} variant="outline">
          🔄 Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Ready Orders</p>
                <p className="text-2xl font-bold text-blue-900">{pendingOrders}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-800">Unpaid Orders</p>
                <p className="text-2xl font-bold text-yellow-900">{unpaidOrders}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Today's Revenue</p>
                <p className="text-2xl font-bold text-green-900">{formatCurrency(totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
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
              <Receipt className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        {[
          { key: 'all', label: 'All Orders' },
          { key: 'pending', label: 'Ready for Payment' },
          { key: 'completed', label: 'Completed Orders' },
          { key: 'paid', label: 'Paid Orders' }
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

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>Manage payments and billing for orders</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const totalPaid = order.payments
                  .filter(payment => payment.status === 'COMPLETED')
                  .reduce((sum, payment) => sum + payment.amount, 0)
                
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">{order.id.slice(-8)}</TableCell>
                    <TableCell>Table {order.table.number}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{getPaymentStatusBadge(order)}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(order.finalAmount || order.totalAmount)}</TableCell>
                    <TableCell>{formatDate(new Date(order.createdAt))}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {order.status === 'COMPLETED' && (
                          <>
                            <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedOrder(order)
                                    setPaymentData({
                                      method: '',
                                      amount: order.finalAmount || order.totalAmount,
                                      transactionId: ''
                                    })
                                  }}
                                  className="flex items-center gap-1"
                                >
                                  <CreditCard className="h-3 w-3" />
                                  Payment
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Process Payment</DialogTitle>
                                  <DialogDescription>
                                    Process payment for Table {order.table.number}
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-4">
                                  <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold mb-2">Order Summary</h3>
                                    <div className="space-y-1 text-sm">
                                      <div className="flex justify-between">
                                        <span>Items:</span>
                                        <span>{order.items.length}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Total Amount:</span>
                                        <span className="font-semibold">{formatCurrency(order.finalAmount || order.totalAmount)}</span>
                                      </div>
                                      {totalPaid > 0 && (
                                        <div className="flex justify-between text-green-600">
                                          <span>Already Paid:</span>
                                          <span>{formatCurrency(totalPaid)}</span>
                                        </div>
                                      )}
                                      <div className="flex justify-between font-semibold">
                                        <span>Remaining:</span>
                                        <span>{formatCurrency((order.finalAmount || order.totalAmount) - totalPaid)}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="paymentMethod">Payment Method</Label>
                                      <Select value={paymentData.method} onValueChange={(value) => setPaymentData(prev => ({ ...prev, method: value }))}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select payment method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="CASH">Cash</SelectItem>
                                          <SelectItem value="CARD">Card</SelectItem>
                                          <SelectItem value="UPI">UPI</SelectItem>
                                          <SelectItem value="WALLET">Wallet</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div>
                                      <Label htmlFor="amount">Amount</Label>
                                      <Input
                                        id="amount"
                                        type="number"
                                        value={paymentData.amount}
                                        onChange={(e) => setPaymentData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                                        placeholder="Enter amount"
                                      />
                                    </div>

                                    {paymentData.method !== 'CASH' && (
                                      <div>
                                        <Label htmlFor="transactionId">Transaction ID (Optional)</Label>
                                        <Input
                                          id="transactionId"
                                          value={paymentData.transactionId}
                                          onChange={(e) => setPaymentData(prev => ({ ...prev, transactionId: e.target.value }))}
                                          placeholder="Enter transaction ID"
                                        />
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                                      Cancel
                                    </Button>
                                    <Button onClick={processPayment}>
                                      Process Payment
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            <BillGenerator order={order} onBillGenerated={fetchOrders} />
                          </>
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
