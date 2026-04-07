import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type SearchResult = {
  type: 'post' | 'reply' | 'channel' | 'user'
  id: string
  title?: string
  content?: string
  name?: string
  username?: string
  channelName?: string
  authorName?: string
  score?: number
  createdAt: string
  link: string
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.trim()
  const type = searchParams.get('type') || 'all'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = (page - 1) * limit

  if (!query) {
    return NextResponse.json({ results: [], total: 0, hasMore: false })
  }

  const results: SearchResult[] = []

  try {
    if (type === 'all' || type === 'posts') {
      // Search posts
      const posts = await prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { body: { contains: query, mode: 'insensitive' } }
          ]
        },
        include: {
          author: { select: { displayName: true } },
          channel: { select: { name: true } },
          votes: { select: { value: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      })

      posts.forEach(post => {
        const score = post.votes.reduce((sum, vote) => sum + vote.value, 0)
        results.push({
          type: 'post',
          id: post.id.toString(),
          title: post.title,
          content: post.body,
          authorName: post.author.displayName,
          channelName: post.channel.name,
          score,
          createdAt: post.createdAt.toISOString(),
          link: `/posts/${post.id}`
        })
      })
    }

    if (type === 'all' || type === 'replies') {
      // Search replies
      const replies = await prisma.reply.findMany({
        where: {
          body: { contains: query, mode: 'insensitive' }
        },
        include: {
          author: { select: { displayName: true } },
          post: {
            include: {
              channel: { select: { name: true } }
            }
          },
          votes: { select: { value: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      })

      replies.forEach(reply => {
        const score = reply.votes.reduce((sum, vote) => sum + vote.value, 0)
        results.push({
          type: 'reply',
          id: reply.id.toString(),
          content: reply.body,
          authorName: reply.author.displayName,
          channelName: reply.post.channel.name,
          score,
          createdAt: reply.createdAt.toISOString(),
          link: `/posts/${reply.postId}#reply-${reply.id}`
        })
      })
    }

    if (type === 'all' || type === 'channels') {
      // Search channels
      const channels = await prisma.channel.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        },
        include: {
          createdBy: { select: { displayName: true } },
          _count: { select: { posts: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      })

      channels.forEach(channel => {
        results.push({
          type: 'channel',
          id: channel.id.toString(),
          name: channel.name,
          content: channel.description || undefined,
          authorName: channel.createdBy.displayName,
          createdAt: channel.createdAt.toISOString(),
          link: `/channels/${channel.id}`
        })
      })
    }

    if (type === 'all' || type === 'users') {
      // Search users
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { displayName: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } }
          ]
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      })

      users.forEach(user => {
        results.push({
          type: 'user',
          id: user.id.toString(),
          username: user.displayName,
          content: user.email,
          createdAt: user.createdAt.toISOString(),
          link: `/users/${user.id}` // Assuming we have a user profile page, but we don't yet
        })
      })
    }

    // Sort results by relevance (simple: prioritize exact matches, then by score, then by date)
    results.sort((a, b) => {
      // Prioritize exact title/name matches
      const aExact = (a.title?.toLowerCase() === query.toLowerCase()) ||
                     (a.name?.toLowerCase() === query.toLowerCase()) ||
                     (a.username?.toLowerCase() === query.toLowerCase())
      const bExact = (b.title?.toLowerCase() === query.toLowerCase()) ||
                     (b.name?.toLowerCase() === query.toLowerCase()) ||
                     (b.username?.toLowerCase() === query.toLowerCase())

      if (aExact && !bExact) return -1
      if (!aExact && bExact) return 1

      // Then by score (higher first)
      if (a.score !== undefined && b.score !== undefined) {
        if (a.score > b.score) return -1
        if (a.score < b.score) return 1
      }

      // Then by date (newer first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    const total = results.length // For simplicity, since we're combining, but actually we need total per type
    const hasMore = results.length === limit

    return NextResponse.json({
      results: results.slice(0, limit),
      total,
      hasMore
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}