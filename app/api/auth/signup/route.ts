import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createAuthCookie, hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const displayName = String(body.displayName || '').trim()
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')

  if (!displayName || !email || !password) {
    return NextResponse.json({ error: 'Display name, email, and password are required.' }, { status: 400 })
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return NextResponse.json({ error: 'A user with that email already exists.' }, { status: 409 })
  }

  const passwordHash = await hashPassword(password)
  const user = await prisma.user.create({
    data: {
      displayName,
      email,
      passwordHash,
      role: 'user',
    },
  })

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
