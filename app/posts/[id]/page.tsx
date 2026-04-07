import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import CreateReplyForm from './CreateReplyForm'
import AddAttachmentForm from './AddAttachmentForm'
import DeletePostButton from '@/app/components/DeletePostButton'
import { getCurrentUser } from '@/lib/auth'
import VoteControls from '@/app/components/VoteControls'
import ReplyTree from '@/app/components/ReplyTree'

const prisma = new PrismaClient()

type ReplyNode = {
  id: number
  body: string
  createdAt: string
  author: {
    displayName: string
  }
  attachments: Array<{ id: number; path: string }>
  parentReplyId: number | null
  childReplies: ReplyNode[]
  score: number
  currentUserVote: number
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const currentUser = await getCurrentUser()

  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    include: {
      author: true,
      channel: true,
      attachments: true,
      votes: true,
      replies: {
        orderBy: { createdAt: 'asc' },
        include: {
          author: true,
          attachments: true,
          votes: true,
        },
      },
    },
  })

  if (!post) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Post not found</h1>
        <Link href="/">← Back to channels</Link>
      </div>
    )
  }

  const postScore = post.votes.reduce((sum, vote) => sum + vote.value, 0)
  const currentPostVote = currentUser
    ? post.votes.find((vote) => vote.userId === currentUser.id)?.value ?? 0
    : 0

  const replyMap = new Map<number, ReplyNode>()
  const replies: ReplyNode[] = post.replies.map((reply) => ({
    id: reply.id,
    body: reply.body,
    createdAt: reply.createdAt.toISOString(),
    author: reply.author,
    attachments: reply.attachments,
    parentReplyId: reply.parentReplyId,
    childReplies: [],
    score: reply.votes.reduce((sum, vote) => sum + vote.value, 0),
    currentUserVote: currentUser
      ? reply.votes.find((vote) => vote.userId === currentUser.id)?.value ?? 0
      : 0,
  }))

  replies.forEach((reply) => replyMap.set(reply.id, reply))

  const topReplies: ReplyNode[] = []
  replies.forEach((reply) => {
    if (reply.parentReplyId == null) {
      topReplies.push(reply)
      return
    }

    const parent = replyMap.get(reply.parentReplyId)
    if (parent) {
      parent.childReplies.push(reply)
    } else {
      topReplies.push(reply)
    }
  })

  return (
    <div style={{ padding: 20, maxWidth: 860, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <div>
          <h1>{post.title}</h1>
          <p style={{ margin: '8px 0 0', color: '#555' }}>
            In <Link href={`/channels/${post.channelId}`}>{post.channel.name}</Link>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {currentUser?.role === 'admin' ? (
            <DeletePostButton postId={id} channelId={post.channelId} />
          ) : null}
          <Link href={`/channels/${post.channelId}`} style={{ color: '#0070f3', textDecoration: 'none' }}>
            ← Back to channel
          </Link>
        </div>
      </div>

      <div
        style={{
          marginTop: 32,
          padding: 18,
          border: '1px solid #e2e8f0',
          borderRadius: 10,
          backgroundColor: '#f9fafb',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ minWidth: 0 }}>
            <strong style={{ fontSize: 18 }}>{post.title}</strong>
            <p style={{ margin: '12px 0 0', whiteSpace: 'pre-wrap' }}>{post.body}</p>
            {post.attachments && post.attachments.length > 0 && (
              <div style={{ marginTop: 12 }}>
                {post.attachments.map((attachment) => (
                  <img
                    key={attachment.id}
                    src={attachment.path}
                    alt="Screenshot"
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: 6 }}
                  />
                ))}
              </div>
            )}
            <p style={{ margin: '12px 0 0', color: '#666', fontSize: 13 }}>
              Author: {post.author?.displayName ?? 'Unknown'}
            </p>
            <p style={{ marginTop: 8, color: '#666', fontSize: 13 }}>
              Posted on {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
          <VoteControls
            targetType="post"
            targetId={post.id}
            currentVote={currentPostVote}
            score={postScore}
            disabled={!currentUser}
          />
        </div>
        {!currentUser ? (
          <p style={{ marginTop: 12, color: '#666', fontSize: 13 }}>
            Sign in to vote on this post.
          </p>
        ) : null}
      </div>

      <section style={{ marginTop: 32 }}>
        <h2>Add Screenshot</h2>
        <AddAttachmentForm postId={id} disabled={!currentUser} />
        {!currentUser ? (
          <p style={{ color: '#a00', marginTop: 12 }}>
            Access denied. Please sign in to add a screenshot.
          </p>
        ) : null}
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Add reply</h2>
        <CreateReplyForm postId={id} disabled={!currentUser} />
        {!currentUser ? (
          <p style={{ color: '#a00', marginTop: 12 }}>
            Access denied. Please sign in to reply.
          </p>
        ) : null}
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Replies</h2>
        {topReplies.length === 0 ? (
          <p>No replies yet. Add the first one above.</p>
        ) : (
          <ReplyTree postId={post.id} replies={topReplies} disabled={!currentUser} />
        )}
      </section>
    </div>
  )
}