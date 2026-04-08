import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { clearAuthCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const token = request.cookies.get('sessionToken')?.value
  if (token) {
    await prisma.session.deleteMany({ where: { id: token } })
  }

  const response = NextResponse.json({ ok: true })
  response.headers.set('Set-Cookie', clearAuthCookie())
  return response
}
