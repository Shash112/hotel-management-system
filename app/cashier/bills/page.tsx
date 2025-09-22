'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Filter, Eye, Download, Print, Receipt, DollarSign, CheckCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

interface Bill {
  id: string
  billNumber: string
  orderId: string
  order: {
    id: string
    table: {
      name: string
    }
    createdAt: string
  }
  customerName?: string
  customerPhone?: string
  subtotal: number
  taxAmount: number
  cgstAmount: number
  sgstAmount: number
  igstAmount: number
  serviceCharge: number
  finalAmount: number
  isPaid: boolean
  createdAt: string
}

export default function CashierBills() {
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchBills()
  }, [])

  const fetchBills = async () => {
    try {
      const response = await fetch('/api/bills')
      if (response.ok) {
        const data = await response.json()
        setBills(data)
      }
    } catch (error) {
      toast.error('Failed to load bills')
    } finally {
      setLoading(false)
    }
  }

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.order.table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (bill.customerName && bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'paid' && bill.isPaid) ||
                         (statusFilter === 'unpaid' && !bill.isPaid)
    return matchesSearch && matchesStatus
  })

  const getBillStats = () => {
    const stats = {
      total: bills.length,
      paid: bills.filter(b => b.isPaid).length,
      unpaid: bills.filter(b => !b.isPaid).length,
      totalRevenue: bills.reduce((sum, bill) => sum + bill.finalAmount, 0),
      paidRevenue: bills.filter(b => b.isPaid).reduce((sum, bill) => sum + bill.finalAmount, 0),
      pendingRevenue: bills.filter(b => !b.isPaid).reduce((sum, bill) => sum + bill.finalAmount, 0)
    }
    return stats
  }

  const stats = getBillStats()

  const handlePrintBill = (billId: string) => {
    // This would integrate with your bill generation component
    toast.success('Bill sent to printer!')
  }

  const handleDownloadBill = (billId: string) => {
    // This would generate and download PDF
    toast.success('Bill downloaded!')
  }

  const handleMarkAsPaid = async (billId: string) => {
    try {
      const response = await fetch(`/api/bills/${billId}/pay`, {
        method: 'POST'
      })

      if (response.ok) {
        toast.success('Bill marked as paid!')
        fetchBills()
      } else {
        toast.error('Failed to mark bill as paid')
      }
    } catch (error) {
      toast.error('Failed to mark bill as paid')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Bill Generation</h1>
          <p className="text-muted-foreground">Manage bills and generate GST-compliant invoices</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-full">
                <Receipt className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-500">Total Bills</p>
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
                <p className="text-2xl font-bold">{stats.paid}</p>
                <p className="text-sm text-gray-500">Paid Bills</p>
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
                <p className="text-2xl font-bold">{stats.unpaid}</p>
                <p className="text-sm text-gray-500">Pending Bills</p>
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

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹{stats.paidRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Paid Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹{stats.pendingRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Pending Revenue</p>
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
                  placeholder="Search by bill number, table, or customer..."
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
                <SelectItem value="all">All Bills</SelectItem>
                <SelectItem value="paid">Paid Bills</SelectItem>
                <SelectItem value="unpaid">Unpaid Bills</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bills Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Bills ({filteredBills.length})
          </CardTitle>
          <CardDescription>
            GST-compliant bills and invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill Number</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Tax (GST)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-mono text-sm font-medium">
                    {bill.billNumber}
                  </TableCell>
                  <TableCell>{bill.order.table.name}</TableCell>
                  <TableCell>
                    {bill.customerName ? (
                      <div>
                        <div className="font-medium">{bill.customerName}</div>
                        {bill.customerPhone && (
                          <div className="text-sm text-gray-500">{bill.customerPhone}</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">Walk-in customer</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">₹{bill.finalAmount}</div>
                      <div className="text-sm text-gray-500">
                        Subtotal: ₹{bill.subtotal}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>CGST: ₹{bill.cgstAmount}</div>
                      <div>SGST: ₹{bill.sgstAmount}</div>
                      {bill.igstAmount > 0 && <div>IGST: ₹{bill.igstAmount}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={bill.isPaid ? "default" : "outline"}>
                      {bill.isPaid ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Paid
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(bill.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handlePrintBill(bill.id)}>
                        <Print className="h-4 w-4 mr-1" />
                        Print
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDownloadBill(bill.id)}>
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      {!bill.isPaid && (
                        <Button size="sm" onClick={() => handleMarkAsPaid(bill.id)}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark Paid
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
