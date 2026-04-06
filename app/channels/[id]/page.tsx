import { PrismaClient } from '@prisma/client'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function ChannelPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const posts = await prisma.post.findMany({
    where: {
      channelId: Number(id),
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div style={{ padding: 20 }}>
      <h1>Channel Posts</h1>
      <Link href="/">← Back to channels</Link>

      <h2>Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <strong>{post.title}</strong> — {post.body}
          </li>
        ))}
      </ul>
    </div>
  )
}