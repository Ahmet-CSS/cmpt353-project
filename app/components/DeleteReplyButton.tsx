'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeleteReplyButtonProps {
  replyId: number
}

export default function DeleteReplyButton({ replyId }: DeleteReplyButtonProps) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Delete this reply permanently?')) return
    setIsPending(true)

    const response = await fetch(`/api/replies/${replyId}`, { method: 'DELETE' })
    setIsPending(false)

    if (response.ok) {
      router.refresh()
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      style={{
        marginTop: 12,
        padding: '8px 12px',
        borderRadius: 6,
        border: '1px solid #e2e8f0',
        backgroundColor: '#fff',
        cursor: isPending ? 'not-allowed' : 'pointer',
      }}
    >
      {isPending ? 'Deleting…' : 'Delete reply'}
    </button>
  )
}
