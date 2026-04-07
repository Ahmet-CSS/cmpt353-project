import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    const reply = await prisma.reply.create({
      data: {
        body: body.body,
        postId: Number(id),
        authorId: user.id,
        parentReplyId: body.parentReplyId ? Number(body.parentReplyId) : null,
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