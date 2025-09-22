'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Users, Clock, CheckCircle, AlertCircle, Plus, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

interface RestaurantTable {
  id: string
  name: string
  capacity: number
  status: string
  currentOrder?: {
    id: string
    totalAmount: number
    createdAt: string
    items: number
  }
}

export default function WaiterTables() {
  const [tables, setTables] = useState<RestaurantTable[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTables()
  }, [])

  const fetchTables = async () => {
    try {
      const response = await fetch('/api/tables')
      if (response.ok) {
        const data = await response.json()
        setTables(data)
      }
    } catch (error) {
      toast.error('Failed to load tables')
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle className="h-4 w-4" />,
          label: 'Available'
        }
      case 'OCCUPIED':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: <Users className="h-4 w-4" />,
          label: 'Occupied'
        }
      case 'RESERVED':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: <Clock className="h-4 w-4" />,
          label: 'Reserved'
        }
      case 'CLEANING':
        return {
          color: 'bg-orange-100 text-orange-800',
          icon: <AlertCircle className="h-4 w-4" />,
          label: 'Cleaning'
        }
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: <AlertCircle className="h-4 w-4" />,
          label: status
        }
    }
  }

  const getTableStats = () => {
    const stats = {
      total: tables.length,
      available: tables.filter(t => t.status === 'AVAILABLE').length,
      occupied: tables.filter(t => t.status === 'OCCUPIED').length,
      reserved: tables.filter(t => t.status === 'RESERVED').length,
      cleaning: tables.filter(t => t.status === 'CLEANING').length
    }
    return stats
  }

  const stats = getTableStats()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Table Management</h1>
          <p className="text-muted-foreground">Monitor table status and manage reservations</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-full">
                <Users className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-500">Total Tables</p>
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
                <p className="text-2xl font-bold">{stats.available}</p>
                <p className="text-sm text-gray-500">Available</p>
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
                <p className="text-2xl font-bold">{stats.occupied}</p>
                <p className="text-sm text-gray-500">Occupied</p>
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
                <p className="text-2xl font-bold">{stats.reserved}</p>
                <p className="text-sm text-gray-500">Reserved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <AlertCircle className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.cleaning}</p>
                <p className="text-sm text-gray-500">Cleaning</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tables.map((table) => {
          const statusInfo = getStatusInfo(table.status)
          return (
            <Card key={table.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{table.name}</CardTitle>
                  <Badge className={statusInfo.color}>
                    {statusInfo.icon}
                    <span className="ml-1">{statusInfo.label}</span>
                  </Badge>
                </div>
                <CardDescription>
                  Capacity: {table.capacity} people
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {table.currentOrder ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Current Order</span>
                        <span className="text-blue-600">₹{table.currentOrder.totalAmount}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {table.currentOrder.items} items • {new Date(table.currentOrder.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        View Order
                      </Button>
                      <Button size="sm" variant="outline">
                        Add Items
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-center py-4 text-gray-500">
                      {table.status === 'AVAILABLE' ? (
                        <div>
                          <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                          <p className="text-sm">Ready for customers</p>
                        </div>
                      ) : table.status === 'RESERVED' ? (
                        <div>
                          <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                          <p className="text-sm">Reserved</p>
                        </div>
                      ) : table.status === 'CLEANING' ? (
                        <div>
                          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                          <p className="text-sm">Being cleaned</p>
                        </div>
                      ) : (
                        <div>
                          <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                          <p className="text-sm">Currently occupied</p>
                        </div>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full" 
                      disabled={table.status !== 'AVAILABLE'}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Start Order
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Tables List View */}
      <Card>
        <CardHeader>
          <CardTitle>All Tables</CardTitle>
          <CardDescription>
            Complete list of all restaurant tables
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Table</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Order</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tables.map((table) => {
                const statusInfo = getStatusInfo(table.status)
                return (
                  <TableRow key={table.id}>
                    <TableCell className="font-medium">{table.name}</TableCell>
                    <TableCell>{table.capacity} people</TableCell>
                    <TableCell>
                      <Badge className={statusInfo.color}>
                        {statusInfo.icon}
                        <span className="ml-1">{statusInfo.label}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {table.currentOrder ? (
                        <div>
                          <div className="font-medium">₹{table.currentOrder.totalAmount}</div>
                          <div className="text-sm text-gray-500">
                            {table.currentOrder.items} items
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">No active order</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {table.currentOrder ? (
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View Order
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            disabled={table.status !== 'AVAILABLE'}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Start Order
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
