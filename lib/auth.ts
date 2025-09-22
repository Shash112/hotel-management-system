import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.isActive) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string, role: string): string {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '24h' }
  )
}

export function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as {
      userId: string
      role: string
    }
  } catch {
    return null
  }
}

export function hasPermission(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = {
    ADMIN: 4,
    CASHIER: 3,
    WAITER: 2,
    COOK: 1,
  }

  return roleHierarchy[userRole as keyof typeof roleHierarchy] >= 
         roleHierarchy[requiredRole as keyof typeof roleHierarchy]
}

export async function requireAuth(handler: any, requiredRole?: string) {
  return async (req: any, res: any) => {
    const { getServerSession } = await import('next-auth')
    const session = await getServerSession(req, res, authOptions)
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (requiredRole && !hasPermission(session.user.role, requiredRole)) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    return handler(req, res)
  }
}
