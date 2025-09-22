import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (session) {
      // Here you could add any cleanup logic, like:
      // - Log the logout event
      // - Clear any server-side sessions
      // - Update last activity timestamp
    }

    return NextResponse.json({ 
      message: 'Logged out successfully',
      success: true 
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}
