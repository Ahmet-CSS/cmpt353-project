import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import DeleteUserButton from '@/app/components/DeleteUserButton'

export default async function UserPage({ params }: { params: { id: string } }) {
  const userId = parseInt(params.id)
  if (isNaN(userId)) notFound()

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: {
        include: { channel: true },
        orderBy: { createdAt: 'desc' },
        take: 10
      },
      replies: {
        include: {
          post: { include: { channel: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      },
      channels: true,
      _count: {
        select: {
          posts: true,
          replies: true,
          channels: true
        }
      }
    }
  })

  if (!user) notFound()

  const currentUser = await getCurrentUser()
  const isAdmin = currentUser?.role === 'admin'
  const canDelete = isAdmin && currentUser.id !== userId

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h1>{user.displayName}</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>

      {canDelete && (
        <div style={{ marginTop: 20 }}>
          <DeleteUserButton userId={userId} userName={user.displayName} />
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <h2>Stats</h2>
        <p>Posts: {user._count.posts}</p>
        <p>Replies: {user._count.replies}</p>
        <p>Channels: {user._count.channels}</p>
      </div>

      <div style={{ marginTop: 20 }}>
        <h2>Recent Posts</h2>
        {user.posts.map(post => (
          <div key={post.id} style={{ border: '1px solid #e2e8f0', padding: 10, marginBottom: 10 }}>
            <h3><a href={`/posts/${post.id}`}>{post.title}</a></h3>
            <p>In {post.channel.name}</p>
            <p>{new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <h2>Recent Replies</h2>
        {user.replies.map(reply => (
          <div key={reply.id} style={{ border: '1px solid #e2e8f0', padding: 10, marginBottom: 10 }}>
            <p>{reply.body.substring(0, 100)}...</p>
            <p>In <a href={`/posts/${reply.postId}`}>{reply.post.title}</a> ({reply.post.channel.name})</p>
            <p>{new Date(reply.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}