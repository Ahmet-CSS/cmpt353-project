import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import CreateReplyForm from './CreateReplyForm'
import AddAttachmentForm from './AddAttachmentForm'

const prisma = new PrismaClient()

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    include: {
      author: true,
      channel: true,
      replies: {
        include: {
          author: true,
          attachments: true,
          childReplies: {
            include: {
              author: true,
              attachments: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
      attachments: true,
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

  return (
    <div style={{ padding: 20, maxWidth: 860, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <div>
          <h1>{post.title}</h1>
          <p style={{ margin: '8px 0 0', color: '#555' }}>
            In <Link href={`/channels/${post.channelId}`}>{post.channel.name}</Link>
          </p>
        </div>
        <Link href={`/channels/${post.channelId}`} style={{ color: '#0070f3', textDecoration: 'none' }}>
          ← Back to channel
        </Link>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <strong style={{ fontSize: 18 }}>{post.title}</strong>
          <span style={{ color: '#555', fontSize: 13 }}>
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>
        <p style={{ margin: '12px 0 0', whiteSpace: 'pre-wrap' }}>{post.body}</p>
        {post.attachments && post.attachments.length > 0 && (
          <div style={{ margin: '12px 0 0' }}>
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
      </div>

      <section style={{ marginTop: 32 }}>
        <h2>Add Screenshot</h2>
        <AddAttachmentForm postId={id} />
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Add reply</h2>
        <CreateReplyForm postId={id} />
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Replies</h2>
        {post.replies.length === 0 ? (
          <p>No replies yet. Add the first one above.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {post.replies.map((reply) => (
              <li
                key={reply.id}
                style={{
                  marginBottom: 18,
                  padding: 18,
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                  backgroundColor: '#f9fafb',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ color: '#555', fontSize: 13 }}>
                    {new Date(reply.createdAt).toLocaleString()}
                  </span>
                </div>
                <p style={{ margin: '12px 0 0', whiteSpace: 'pre-wrap' }}>{reply.body}</p>
                {reply.attachments && reply.attachments.length > 0 && (
                  <div style={{ margin: '12px 0 0' }}>
                    {reply.attachments.map((attachment) => (
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
                  Author: {reply.author?.displayName ?? 'Unknown'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}