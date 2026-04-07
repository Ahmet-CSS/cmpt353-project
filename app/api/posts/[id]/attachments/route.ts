import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Access denied' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const attachment = await prisma.attachment.create({
      data: {
        mimeType: body.mimeType,
        sizeBytes: body.sizeBytes,
        path: body.path,
        postId: Number(id),
      },
    })

    return NextResponse.json(attachment)
  } catch (error) {
    console.error('POST /api/posts/[id]/attachments failed:', error)
    return NextResponse.json({ error: 'Failed to add attachment' }, { status: 500 })
  }
}