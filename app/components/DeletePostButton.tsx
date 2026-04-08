'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeletePostButtonProps {
  postId: string
  channelId: number
}

export default function DeletePostButton({ postId, channelId }: DeletePostButtonProps) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Delete this post permanently?')) return
    setIsPending(true)

    const response = await fetch(`/api/posts/${postId}`, { method: 'DELETE' })
    setIsPending(false)

    if (response.ok) {
      router.push(`/channels/${channelId}`)
      router.refresh()
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      style={{
        padding: '8px 12px',
        borderRadius: 6,
        border: '1px solid #e2e8f0',
        backgroundColor: '#fff',
        cursor: isPending ? 'not-allowed' : 'pointer',
      }}
    >
      {isPending ? 'Deleting…' : 'Delete post'}
    </button>
  )
}
