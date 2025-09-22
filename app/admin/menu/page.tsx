'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Edit, Trash2, Search, Filter, Menu, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: {
    id: string
    name: string
  }
  isVeg: boolean
  isAvailable: boolean
  sortOrder: number
}

interface Category {
  id: string
  name: string
  description: string
  sortOrder: number
}

export default function AdminMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    isVeg: false,
    isAvailable: true,
    sortOrder: ''
  })

  useEffect(() => {
    fetchMenuItems()
    fetchCategories()
  }, [])

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu-items')
      if (response.ok) {
        const data = await response.json()
        setMenuItems(data)
      }
    } catch (error) {
      toast.error('Failed to load menu items')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      toast.error('Failed to load categories')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const method = editingItem ? 'PUT' : 'POST'
      const url = editingItem ? `/api/menu-items/${editingItem.id}` : '/api/menu-items'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          sortOrder: parseInt(formData.sortOrder)
        })
      })

      if (response.ok) {
        toast.success(editingItem ? 'Menu item updated!' : 'Menu item created!')
        fetchMenuItems()
        resetForm()
      } else {
        toast.error('Failed to save menu item')
      }
    } catch (error) {
      toast.error('Failed to save menu item')
    }
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      categoryId: item.category.id,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      sortOrder: item.sortOrder.toString()
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      try {
        const response = await fetch(`/api/menu-items/${id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          toast.success('Menu item deleted!')
          fetchMenuItems()
        } else {
          toast.error('Failed to delete menu item')
        }
      } catch (error) {
        toast.error('Failed to delete menu item')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      categoryId: '',
      isVeg: false,
      isAvailable: true,
      sortOrder: ''
    })
    setEditingItem(null)
    setIsDialogOpen(false)
  }

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category.id === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Menu Management</h1>
          <p className="text-muted-foreground">Manage menu items, categories, and pricing</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update the menu item details' : 'Create a new menu item for your restaurant'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Chicken Biryani"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="299"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description of the dish"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.categoryId} onValueChange={(value) => setFormData({...formData, categoryId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({...formData, sortOrder: e.target.value})}
                    placeholder="1"
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Options</Label>
                  <div className="flex space-x-4 pt-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.isVeg}
                        onChange={(e) => setFormData({...formData, isVeg: e.target.checked})}
                        className="rounded"
                      />
                      <span className="text-sm">Vegetarian</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.isAvailable}
                        onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})}
                        className="rounded"
                      />
                      <span className="text-sm">Available</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingItem ? 'Update' : 'Create'} Item
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Menu Items Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Menu className="h-5 w-5" />
            Menu Items ({filteredItems.length})
          </CardTitle>
          <CardDescription>
            Manage your restaurant's menu items and pricing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>{item.category.name}</TableCell>
                  <TableCell className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {item.price}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.isVeg ? "default" : "secondary"}>
                      {item.isVeg ? "Veg" : "Non-Veg"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.isAvailable ? "default" : "outline"}>
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
