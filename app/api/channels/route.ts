import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const channels = await prisma.channel.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
  return NextResponse.json(channels)
}

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: 'Access denied' }, { status: 401 })
  }

  const body = await request.json()
  const channel = await prisma.channel.create({
    data: {
      name: body.name,
      description: body.description || '',
      createdById: user.id,
    },
  })
  return NextResponse.json(channel)
}   