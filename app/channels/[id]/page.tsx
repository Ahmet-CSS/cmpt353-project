import Link from 'next/link'
import CreatePostForm from './CreatePostForm'
import DeleteChannelButton from '@/app/components/DeleteChannelButton'
import DeletePostButton from '@/app/components/DeletePostButton'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function ChannelPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const currentUser = await getCurrentUser()

  // Decode the URL parameter in case it was encoded
  const decodedId = decodeURIComponent(id)

  // Accept both channel slug name and numeric channel id
  let channel = await prisma.channel.findUnique({
    where: { name: decodedId },
  })

  if (!channel && !Number.isNaN(Number(decodedId))) {
    channel = await prisma.channel.findUnique({
      where: { id: Number(decodedId) },
    })
  }

  if (!channel) {
    return <div style={{ padding: 20 }}>Channel not found.</div>
  }

  const posts = await prisma.post.findMany({
    where: {
      channelId: channel.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      author: true,
      attachments: true,
    },
  })

  return (
    <div style={{ padding: 20, maxWidth: 860, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <div>
          <h1>Channel: {channel.name}</h1>
          <p style={{ margin: '8px 0 0', color: '#555' }}>
            {channel.description || 'Create posts and read existing messages for this channel.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {currentUser?.role === 'admin' && <DeleteChannelButton channelName={channel.name} />}
          <Link href="/" style={{ color: '#0070f3', textDecoration: 'none' }}>
            ← Back to channels
          </Link>
        </div>
      </div>

      <section style={{ marginTop: 32 }}>
        <h2>Create post</h2>
        <CreatePostForm channelId={String(channel.id)} disabled={!currentUser} />
        {!currentUser ? (
          <p style={{ color: '#a00', marginTop: 12 }}>
            Access denied. Please sign in to create a post.
          </p>
        ) : null}
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Posts</h2>
        {posts.length === 0 ? (
          <p>No posts yet. Create the first one above.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {posts.map((post) => (
              <li key={post.id}>
                <div
                  style={{
                    marginBottom: 18,
                    padding: 18,
                    border: '1px solid #e2e8f0',
                    borderRadius: 10,
                    backgroundColor: '#f9fafb',
                  }}
                >
                  <Link
                    href={`/posts/${post.id}`}
                    style={{
                      display: 'block',
                      textDecoration: 'none',
                      color: 'inherit',
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
                  </Link>
                  {currentUser?.role === 'admin' && (
                    <div style={{ marginTop: 12 }}>
                      <DeletePostButton postId={String(post.id)} channelId={channel.id} />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}