import { Header } from '@/components/layout/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Menu, DollarSign } from 'lucide-react'

export default function AdminMenuPage() {
  // Mock data for now - will be replaced with real API calls later
  const mockMenuItems = [
    { id: '1', name: 'Chicken Biryani', description: 'Fragrant basmati rice with tender chicken', price: 299, category: { name: 'Main Course' }, isVeg: false, isActive: true },
    { id: '2', name: 'Paneer Tikka', description: 'Grilled cottage cheese with spices', price: 199, category: { name: 'Appetizer' }, isVeg: true, isActive: true },
    { id: '3', name: 'Gulab Jamun', description: 'Sweet milk dumplings in rose syrup', price: 89, category: { name: 'Dessert' }, isVeg: true, isActive: true },
    { id: '4', name: 'Dal Makhani', description: 'Creamy black lentils with butter', price: 179, category: { name: 'Main Course' }, isVeg: true, isActive: true },
    { id: '5', name: 'Butter Chicken', description: 'Tender chicken in rich tomato gravy', price: 329, category: { name: 'Main Course' }, isVeg: false, isActive: true },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  return (
    <>
      <Header title="Menu Management" description="Add, edit, and organize menu items and categories." />
      <div className="container mx-auto py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">Total Items</p>
                  <p className="text-2xl font-bold text-blue-900">{mockMenuItems.length}</p>
                </div>
                <Menu className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Active Items</p>
                  <p className="text-2xl font-bold text-green-900">{mockMenuItems.filter(item => item.isActive).length}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-800">Categories</p>
                  <p className="text-2xl font-bold text-orange-900">4</p>
                </div>
                <Menu className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Menu Items */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Menu Items</CardTitle>
                <CardDescription>Manage your restaurant menu items</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockMenuItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{item.name}</h3>
                      <Badge variant={item.isVeg ? 'default' : 'secondary'}>
                        {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                      </Badge>
                      <Badge variant={item.isActive ? 'default' : 'secondary'}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    <p className="text-sm text-muted-foreground">Category: {item.category.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">{formatCurrency(item.price)}</p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">Delete</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Manage menu categories</CardDescription>
              </div>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Appetizers', 'Main Course', 'Desserts', 'Beverages'].map((category) => (
                <div key={category} className="p-4 border rounded-lg text-center">
                  <h3 className="font-medium">{category}</h3>
                  <p className="text-sm text-muted-foreground">
                    {mockMenuItems.filter(item => item.category.name === category).length} items
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}