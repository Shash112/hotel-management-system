import { Header } from '@/components/layout/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Receipt, DollarSign, CheckCircle, Clock, Download, Print } from 'lucide-react'

export default function CashierBillsPage() {
  // Mock data for now - will be replaced with real API calls later
  const mockBills = [
    { 
      id: '1', 
      billNumber: 'BILL-001', 
      tableNumber: '5', 
      totalAmount: 1250, 
      status: 'PAID', 
      paymentMethod: 'CASH',
      createdAt: '2024-01-20T14:30:00Z',
      items: 4
    },
    { 
      id: '2', 
      billNumber: 'BILL-002', 
      tableNumber: '3', 
      totalAmount: 890, 
      status: 'PENDING', 
      paymentMethod: 'CARD',
      createdAt: '2024-01-20T15:45:00Z',
      items: 3
    },
    { 
      id: '3', 
      billNumber: 'BILL-003', 
      tableNumber: '7', 
      totalAmount: 2100, 
      status: 'PAID', 
      paymentMethod: 'UPI',
      createdAt: '2024-01-20T16:15:00Z',
      items: 6
    },
    { 
      id: '4', 
      billNumber: 'BILL-004', 
      tableNumber: '2', 
      totalAmount: 650, 
      status: 'PAID', 
      paymentMethod: 'CASH',
      createdAt: '2024-01-20T17:00:00Z',
      items: 2
    },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PAID: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      CANCELLED: 'bg-red-100 text-red-800'
    }
    
    return (
      <Badge className={statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    )
  }

  const getPaymentMethodBadge = (method: string) => {
    const methodConfig = {
      CASH: 'bg-blue-100 text-blue-800',
      CARD: 'bg-purple-100 text-purple-800',
      UPI: 'bg-green-100 text-green-800',
      WALLET: 'bg-orange-100 text-orange-800'
    }
    
    return (
      <Badge className={methodConfig[method as keyof typeof methodConfig] || 'bg-gray-100 text-gray-800'}>
        {method}
      </Badge>
    )
  }

  const totalRevenue = mockBills
    .filter(bill => bill.status === 'PAID')
    .reduce((sum, bill) => sum + bill.totalAmount, 0)

  const pendingBills = mockBills.filter(bill => bill.status === 'PENDING').length

  return (
    <>
      <Header title="Bill Generation" description="Generate and manage bills for customer orders." />
      <div className="container mx-auto py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">Total Bills</p>
                  <p className="text-2xl font-bold text-blue-900">{mockBills.length}</p>
                </div>
                <Receipt className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-800">Pending Bills</p>
                  <p className="text-2xl font-bold text-yellow-900">{pendingBills}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-800">Paid Bills</p>
                  <p className="text-2xl font-bold text-purple-900">{mockBills.filter(bill => bill.status === 'PAID').length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Bill Management</CardTitle>
            <CardDescription>Search and manage customer bills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <Input placeholder="Search by bill number or table..." className="flex-1" />
              <Button variant="outline">Filter</Button>
            </div>

            {/* Bills List */}
            <div className="space-y-4">
              {mockBills.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{bill.billNumber}</h3>
                      {getStatusBadge(bill.status)}
                      {getPaymentMethodBadge(bill.paymentMethod)}
                    </div>
                    <p className="text-sm text-muted-foreground">Table {bill.tableNumber} • {bill.items} items</p>
                    <p className="text-sm text-muted-foreground">{formatDate(bill.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">{formatCurrency(bill.totalAmount)}</p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline">
                        <Download className="mr-1 h-3 w-3" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline">
                        <Print className="mr-1 h-3 w-3" />
                        Print
                      </Button>
                      {bill.status === 'PENDING' && (
                        <Button size="sm">Process Payment</Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods Summary</CardTitle>
            <CardDescription>Breakdown of payments by method</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Cash</p>
                <p className="text-2xl font-bold">₹{mockBills.filter(b => b.paymentMethod === 'CASH' && b.status === 'PAID').reduce((sum, b) => sum + b.totalAmount, 0)}</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Card</p>
                <p className="text-2xl font-bold">₹{mockBills.filter(b => b.paymentMethod === 'CARD' && b.status === 'PAID').reduce((sum, b) => sum + b.totalAmount, 0)}</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">UPI</p>
                <p className="text-2xl font-bold">₹{mockBills.filter(b => b.paymentMethod === 'UPI' && b.status === 'PAID').reduce((sum, b) => sum + b.totalAmount, 0)}</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Wallet</p>
                <p className="text-2xl font-bold">₹0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}