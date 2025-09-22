'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  DollarSign, 
  Receipt, 
  Users, 
  Clock,
  CreditCard,
  Banknote
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ReportData {
  date: string
  totalOrders: number
  totalRevenue: number
  paidOrders: number
  pendingOrders: number
  averageOrderValue: number
  paymentMethods: {
    cash: number
    card: number
    upi: number
    wallet: number
  }
}

interface DailyStats {
  today: ReportData
  yesterday: ReportData
  thisWeek: ReportData
  thisMonth: ReportData
}

export default function CashierReports() {
  const [reportData, setReportData] = useState<DailyStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('today')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')

  useEffect(() => {
    fetchReportData()
  }, [])

  const fetchReportData = async () => {
    try {
      // Mock data - replace with actual API call
      const mockData: DailyStats = {
        today: {
          date: new Date().toISOString().split('T')[0],
          totalOrders: 45,
          totalRevenue: 125000,
          paidOrders: 42,
          pendingOrders: 3,
          averageOrderValue: 2777,
          paymentMethods: {
            cash: 45000,
            card: 35000,
            upi: 30000,
            wallet: 15000
          }
        },
        yesterday: {
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          totalOrders: 38,
          totalRevenue: 98000,
          paidOrders: 35,
          pendingOrders: 3,
          averageOrderValue: 2578,
          paymentMethods: {
            cash: 38000,
            card: 28000,
            upi: 25000,
            wallet: 7000
          }
        },
        thisWeek: {
          date: 'This Week',
          totalOrders: 312,
          totalRevenue: 856000,
          paidOrders: 298,
          pendingOrders: 14,
          averageOrderValue: 2743,
          paymentMethods: {
            cash: 342000,
            card: 256000,
            upi: 180000,
            wallet: 78000
          }
        },
        thisMonth: {
          date: 'This Month',
          totalOrders: 1245,
          totalRevenue: 3456000,
          paidOrders: 1189,
          pendingOrders: 56,
          averageOrderValue: 2775,
          paymentMethods: {
            cash: 1382400,
            card: 1036800,
            upi: 691200,
            wallet: 345600
          }
        }
      }
      
      setReportData(mockData)
    } catch (error) {
      toast.error('Failed to load report data')
    } finally {
      setLoading(false)
    }
  }

  const getCurrentData = () => {
    if (!reportData) return null
    switch (dateRange) {
      case 'today':
        return reportData.today
      case 'yesterday':
        return reportData.yesterday
      case 'week':
        return reportData.thisWeek
      case 'month':
        return reportData.thisMonth
      default:
        return reportData.today
    }
  }

  const handleExportReport = () => {
    toast.success('Report exported successfully!')
  }

  const currentData = getCurrentData()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Daily Reports</h1>
          <p className="text-muted-foreground">View sales and payment reports</p>
        </div>
        <Button onClick={handleExportReport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Date Range Selector */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="dateRange">Report Period</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {dateRange === 'custom' && (
              <>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      {currentData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Receipt className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{currentData.totalOrders}</p>
                  <p className="text-sm text-gray-500">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₹{currentData.totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₹{currentData.averageOrderValue.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Avg Order Value</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{currentData.paidOrders}/{currentData.totalOrders}</p>
                  <p className="text-sm text-gray-500">Paid Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Payment Methods Breakdown */}
      {currentData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Payment Methods
            </CardTitle>
            <CardDescription>
              Revenue breakdown by payment method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Banknote className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-lg font-bold">₹{currentData.paymentMethods.cash.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Cash</p>
                    <p className="text-xs text-gray-400">
                      {((currentData.paymentMethods.cash / currentData.totalRevenue) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-lg font-bold">₹{currentData.paymentMethods.card.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Card</p>
                    <p className="text-xs text-gray-400">
                      {((currentData.paymentMethods.card / currentData.totalRevenue) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-lg font-bold">₹{currentData.paymentMethods.upi.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">UPI</p>
                    <p className="text-xs text-gray-400">
                      {((currentData.paymentMethods.upi / currentData.totalRevenue) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-lg font-bold">₹{currentData.paymentMethods.wallet.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Wallet</p>
                    <p className="text-xs text-gray-400">
                      {((currentData.paymentMethods.wallet / currentData.totalRevenue) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Latest payment transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Mock recent transactions */}
              {[
                { id: 'TXN001', order: 'ORD-001', amount: 1250, method: 'UPI', status: 'Completed', time: '2 min ago' },
                { id: 'TXN002', order: 'ORD-002', amount: 890, method: 'Cash', status: 'Completed', time: '5 min ago' },
                { id: 'TXN003', order: 'ORD-003', amount: 2150, method: 'Card', status: 'Completed', time: '8 min ago' },
                { id: 'TXN004', order: 'ORD-004', amount: 750, method: 'Wallet', status: 'Pending', time: '12 min ago' },
                { id: 'TXN005', order: 'ORD-005', amount: 1650, method: 'UPI', status: 'Completed', time: '15 min ago' },
              ].map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                  <TableCell className="font-medium">{transaction.order}</TableCell>
                  <TableCell>₹{transaction.amount}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{transaction.method}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={transaction.status === 'Completed' ? 'default' : 'outline'}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{transaction.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
