'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: '/auth/login'
      })
      toast.success('Logged out successfully')
      router.push('/auth/login')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      className="flex items-center gap-2"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  )
}
