'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, ShoppingCart, ChefHat, CreditCard, BarChart3, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const { data: session } = useSession()

  const stats = [
    {
      title: 'Active Orders',
      value: '12',
      change: '+2.5%',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Today\'s Revenue',
      value: '₹45,230',
      change: '+12.3%',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Customers',
      value: '89',
      change: '+5.2%',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Kitchen Orders',
      value: '8',
      change: '+1.2%',
      icon: ChefHat,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      action: 'New order created',
      details: 'Table 5 - ₹1,250',
      time: '2 minutes ago',
      type: 'order'
    },
    {
      id: 2,
      action: 'Payment processed',
      details: 'Table 3 - ₹890',
      time: '5 minutes ago',
      type: 'payment'
    },
    {
      id: 3,
      action: 'Order completed',
      details: 'Table 2 - Kitchen',
      time: '8 minutes ago',
      type: 'kitchen'
    },
    {
      id: 4,
      action: 'Bill generated',
      details: 'Table 1 - ₹1,450',
      time: '12 minutes ago',
      type: 'billing'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {session?.user?.name}! 👋
        </h1>
        <p className="text-blue-100">
          Here's what's happening at your restaurant today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-green-600">{stat.change} from yesterday</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Recent Activities
            </CardTitle>
            <CardDescription>
              Latest actions in your restaurant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'order' ? 'bg-blue-500' :
                    activity.type === 'payment' ? 'bg-green-500' :
                    activity.type === 'kitchen' ? 'bg-orange-500' :
                    'bg-purple-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.details}</p>
                  </div>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks for your role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {session?.user?.role === 'WAITER' && (
                <>
                  <div className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 cursor-pointer transition-colors">
                    <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-semibold text-sm">New Order</h3>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 cursor-pointer transition-colors">
                    <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <h3 className="font-semibold text-sm">View Tables</h3>
                  </div>
                </>
              )}
              
              {session?.user?.role === 'CASHIER' && (
                <>
                  <div className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 cursor-pointer transition-colors">
                    <CreditCard className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <h3 className="font-semibold text-sm">Process Payment</h3>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 cursor-pointer transition-colors">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-semibold text-sm">Generate Bill</h3>
                  </div>
                </>
              )}
              
              {session?.user?.role === 'COOK' && (
                <>
                  <div className="p-4 bg-orange-50 rounded-lg text-center hover:bg-orange-100 cursor-pointer transition-colors">
                    <ChefHat className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                    <h3 className="font-semibold text-sm">Kitchen Display</h3>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 cursor-pointer transition-colors">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <h3 className="font-semibold text-sm">Update Status</h3>
                  </div>
                </>
              )}
              
              {session?.user?.role === 'ADMIN' && (
                <>
                  <div className="p-4 bg-red-50 rounded-lg text-center hover:bg-red-100 cursor-pointer transition-colors">
                    <Users className="h-8 w-8 mx-auto mb-2 text-red-600" />
                    <h3 className="font-semibold text-sm">Manage Users</h3>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 cursor-pointer transition-colors">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-semibold text-sm">System Settings</h3>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
