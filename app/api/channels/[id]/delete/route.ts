import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUserFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: 'Access denied' }, { status: 401 })
  }

  // Only admins can delete channels
  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can delete channels' }, { status: 403 })
  }

  const { id } = await params

  // Find channel by name
  const channel = await prisma.channel.findUnique({
    where: { name: id },
  })

  if (!channel) {
    return NextResponse.json({ error: 'Channel not found' }, { status: 404 })
  }

  await prisma.channel.delete({
    where: { id: channel.id },
  })

  return NextResponse.json({ success: true })
}
