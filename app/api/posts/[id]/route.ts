import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
      include: {
        author: true,
        channel: true,
        replies: {
          include: {
            author: true,
            childReplies: {
              include: {
                author: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('GET /api/posts/[id] failed:', error)
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}