'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Save, RefreshCw, Settings, Palette, Database, Bell } from 'lucide-react'
import toast from 'react-hot-toast'

interface SystemConfig {
  id: string
  key: string
  value: string
  description?: string
  category: string
}

export default function AdminSettings() {
  const [configs, setConfigs] = useState<SystemConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchConfigs()
  }, [])

  const fetchConfigs = async () => {
    try {
      const response = await fetch('/api/admin/system-configs')
      if (response.ok) {
        const data = await response.json()
        setConfigs(data)
      }
    } catch (error) {
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Save each config individually
      for (const config of configs) {
        await fetch(`/api/admin/system-configs/${config.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: config.value })
        })
      }
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const updateConfig = (id: string, value: string) => {
    setConfigs(prev => prev.map(config => 
      config.id === id ? { ...config, value } : config
    ))
  }

  const getConfigsByCategory = (category: string) => {
    return configs.filter(config => config.category === category)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">Configure hotel settings and preferences</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
          {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Settings
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="gst" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            GST & Tax
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hotel Information</CardTitle>
              <CardDescription>
                Basic information about your hotel or restaurant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {getConfigsByCategory('hotel').map((config) => (
                <div key={config.id} className="space-y-2">
                  <Label htmlFor={config.id} className="capitalize">
                    {config.key.replace(/_/g, ' ')}
                  </Label>
                  <Input
                    id={config.id}
                    value={config.value}
                    onChange={(e) => updateConfig(config.id, e.target.value)}
                    placeholder={config.description}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme & Branding</CardTitle>
              <CardDescription>
                Customize the appearance of your system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {getConfigsByCategory('theme').map((config) => (
                <div key={config.id} className="space-y-2">
                  <Label htmlFor={config.id} className="capitalize">
                    {config.key.replace(/_/g, ' ')}
                  </Label>
                  <Input
                    id={config.id}
                    value={config.value}
                    onChange={(e) => updateConfig(config.id, e.target.value)}
                    placeholder={config.description}
                    type={config.key.includes('color') ? 'color' : 'text'}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gst" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tax Configuration</CardTitle>
              <CardDescription>
                Configure GST rates and tax settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {getConfigsByCategory('tax').map((config) => (
                <div key={config.id} className="space-y-2">
                  <Label htmlFor={config.id} className="capitalize">
                    {config.key.replace(/_/g, ' ')} (%)
                  </Label>
                  <Input
                    id={config.id}
                    type="number"
                    value={config.value}
                    onChange={(e) => updateConfig(config.id, e.target.value)}
                    placeholder={config.description}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure system notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Order Notifications</h3>
                    <p className="text-sm text-gray-500">Get notified when new orders arrive</p>
                  </div>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Payment Alerts</h3>
                    <p className="text-sm text-gray-500">Notifications for payment processing</p>
                  </div>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Low Stock Alerts</h3>
                    <p className="text-sm text-gray-500">Warnings when inventory is low</p>
                  </div>
                  <Badge variant="outline">Disabled</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Daily Reports</h3>
                    <p className="text-sm text-gray-500">End of day summary reports</p>
                  </div>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
