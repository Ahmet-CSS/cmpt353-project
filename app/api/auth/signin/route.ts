import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createAuthCookie, verifyPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
  }

  const passwordMatches = await verifyPassword(password, user.passwordHash)
  if (!passwordMatches) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
  }

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      expiresAt: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000),
    },
  })

  const response = NextResponse.json({ user: { id: user.id, displayName: user.displayName, role: user.role } })
  response.headers.set('Set-Cookie', createAuthCookie(session.id))
  return response
}
