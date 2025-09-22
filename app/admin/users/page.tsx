import { Header } from '@/components/layout/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus, Users, UserCheck, UserX } from 'lucide-react'

export default function AdminUsersPage() {
  // Mock data for now - will be replaced with real API calls later
  const mockUsers = [
    { id: '1', name: 'Admin User', email: 'admin@hotel.com', role: 'ADMIN', isActive: true, createdAt: '2024-01-15' },
    { id: '2', name: 'John Waiter', email: 'waiter@hotel.com', role: 'WAITER', isActive: true, createdAt: '2024-01-16' },
    { id: '3', name: 'Jane Cashier', email: 'cashier@hotel.com', role: 'CASHIER', isActive: true, createdAt: '2024-01-17' },
    { id: '4', name: 'Mike Cook', email: 'cook@hotel.com', role: 'COOK', isActive: true, createdAt: '2024-01-18' },
    { id: '5', name: 'Sarah Manager', email: 'manager@hotel.com', role: 'WAITER', isActive: false, createdAt: '2024-01-19' },
  ]

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      ADMIN: 'bg-red-100 text-red-800',
      CASHIER: 'bg-blue-100 text-blue-800',
      WAITER: 'bg-green-100 text-green-800',
      COOK: 'bg-orange-100 text-orange-800'
    }
    
    return (
      <Badge className={roleConfig[role as keyof typeof roleConfig] || 'bg-gray-100 text-gray-800'}>
        {role}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <>
      <Header title="User Management" description="Create, edit, and manage user accounts and roles." />
      <div className="container mx-auto py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">Total Users</p>
                  <p className="text-2xl font-bold text-blue-900">{mockUsers.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Active Users</p>
                  <p className="text-2xl font-bold text-green-900">{mockUsers.filter(user => user.isActive).length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-800">Waiters</p>
                  <p className="text-2xl font-bold text-orange-900">{mockUsers.filter(user => user.role === 'WAITER').length}</p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-800">Inactive</p>
                  <p className="text-2xl font-bold text-purple-900">{mockUsers.filter(user => !user.isActive).length}</p>
                </div>
                <UserX className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add User Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add New User</CardTitle>
            <CardDescription>Create a new user account for the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="userName">Full Name</Label>
                <Input id="userName" placeholder="Enter full name" />
              </div>
              <div>
                <Label htmlFor="userEmail">Email Address</Label>
                <Input id="userEmail" type="email" placeholder="Enter email address" />
              </div>
              <div>
                <Label htmlFor="userPassword">Password</Label>
                <Input id="userPassword" type="password" placeholder="Enter password" />
              </div>
              <div>
                <Label htmlFor="userRole">Role</Label>
                <Input id="userRole" placeholder="ADMIN, WAITER, CASHIER, COOK" />
              </div>
            </div>
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create User
            </Button>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Manage existing user accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{user.name}</h3>
                      {getRoleBadge(user.role)}
                      <Badge variant={user.isActive ? 'default' : 'secondary'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground">Joined: {formatDate(user.createdAt)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="outline">
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button size="sm" variant="outline">Reset Password</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}