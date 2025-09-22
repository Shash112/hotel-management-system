import { Header } from '@/components/layout/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Save, Settings, Palette, Database, Bell } from 'lucide-react'

export default function AdminSettingsPage() {
  return (
    <>
      <Header title="System Settings" description="Manage hotel information, themes, and tax configurations." />
      <div className="container mx-auto py-8 space-y-6">
        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Hotel Information
            </CardTitle>
            <CardDescription>Basic hotel and restaurant information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hotelName">Hotel Name</Label>
                <Input id="hotelName" defaultValue="Hotel Management System" />
              </div>
              <div>
                <Label htmlFor="hotelAddress">Address</Label>
                <Input id="hotelAddress" defaultValue="123 Main Street, City, State" />
              </div>
              <div>
                <Label htmlFor="hotelPhone">Phone Number</Label>
                <Input id="hotelPhone" defaultValue="+1 (555) 123-4567" />
              </div>
              <div>
                <Label htmlFor="hotelEmail">Email</Label>
                <Input id="hotelEmail" defaultValue="info@hotel.com" />
              </div>
            </div>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Information
            </Button>
          </CardContent>
        </Card>

        {/* Tax Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Tax Configuration
            </CardTitle>
            <CardDescription>Configure GST and tax settings for India</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cgstRate">CGST Rate (%)</Label>
                <Input id="cgstRate" type="number" defaultValue="9" />
              </div>
              <div>
                <Label htmlFor="sgstRate">SGST Rate (%)</Label>
                <Input id="sgstRate" type="number" defaultValue="9" />
              </div>
              <div>
                <Label htmlFor="igstRate">IGST Rate (%)</Label>
                <Input id="igstRate" type="number" defaultValue="18" />
              </div>
              <div>
                <Label htmlFor="serviceCharge">Service Charge (%)</Label>
                <Input id="serviceCharge" type="number" defaultValue="5" />
              </div>
            </div>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Tax Settings
            </Button>
          </CardContent>
        </Card>

        {/* Theme Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Theme & Branding
            </CardTitle>
            <CardDescription>Customize the appearance and branding</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <Input id="primaryColor" type="color" defaultValue="#3B82F6" />
              </div>
              <div>
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <Input id="secondaryColor" type="color" defaultValue="#10B981" />
              </div>
            </div>
            <div>
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input id="logoUrl" defaultValue="https://example.com/logo.png" />
            </div>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Theme Settings
            </Button>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              System Status
            </CardTitle>
            <CardDescription>Current system health and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Database Connection</span>
                <Badge className="bg-green-100 text-green-800">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Authentication Service</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>API Services</span>
                <Badge className="bg-green-100 text-green-800">Running</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>File Storage</span>
                <Badge className="bg-green-100 text-green-800">Available</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}