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

    const reply = await prisma.reply.create({
      data: {
        body: body.body,
        postId: Number(id),
        authorId: 1, // TODO: get from auth
      },
      include: {
        author: true,
      },
    })

    if (body.attachmentPath) {
      await prisma.attachment.create({
        data: {
          mimeType: body.mimeType || 'image/png',
          sizeBytes: body.sizeBytes || 0,
          path: body.attachmentPath,
          replyId: reply.id,
        },
      })
    }

    return NextResponse.json(reply)
  } catch (error) {
    console.error('POST /api/posts/[id]/replies failed:', error)
    return NextResponse.json({ error: 'Failed to create reply' }, { status: 500 })
  }
}