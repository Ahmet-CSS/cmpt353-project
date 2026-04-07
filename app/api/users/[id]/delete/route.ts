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

  // Only admins can delete users
  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can delete users' }, { status: 403 })
  }

  const { id } = await params
  const userIdToDelete = parseInt(id)

  if (isNaN(userIdToDelete)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
  }

  // Prevent admin from deleting themselves
  if (userIdToDelete === user.id) {
    return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
  }

  // Check if user exists
  const userToDelete = await prisma.user.findUnique({
    where: { id: userIdToDelete },
  })

  if (!userToDelete) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Delete the user (cascade will handle related data)
  await prisma.user.delete({
    where: { id: userIdToDelete },
  })

  return NextResponse.json({ success: true })
}