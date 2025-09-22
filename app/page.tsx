import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login')
  }

  // Redirect based on user role
  switch (session.user.role) {
    case 'ADMIN':
      redirect('/admin/dashboard')
    case 'CASHIER':
      redirect('/cashier/dashboard')
    case 'WAITER':
      redirect('/waiter/dashboard')
    case 'COOK':
      redirect('/kitchen/dashboard')
    default:
      redirect('/dashboard')
  }
}
