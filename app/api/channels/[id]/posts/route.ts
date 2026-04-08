import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const posts = await prisma.post.findMany({
      where: {
        channelId: Number(id),
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: true,
      },
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('GET /api/channels/[id]/posts failed:', error)
    return NextResponse.json([], { status: 500 })
  }
}

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

    const post = await prisma.post.create({
      data: {
        title: body.title,
        body: body.body,
        channelId: Number(id),
        authorId: user.id,
      },
    })

    if (body.attachmentPath) {
      await prisma.attachment.create({
        data: {
          mimeType: body.mimeType || 'image/png',
          sizeBytes: body.sizeBytes || 0,
          path: body.attachmentPath,
          postId: post.id,
        },
      })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('POST /api/channels/[id]/posts failed:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
