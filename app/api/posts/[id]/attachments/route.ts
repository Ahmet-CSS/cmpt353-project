import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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