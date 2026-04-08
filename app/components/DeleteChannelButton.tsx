'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeleteChannelButtonProps {
  channelName: string
}

export default function DeleteChannelButton({ channelName }: DeleteChannelButtonProps) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Delete this channel permanently? This will delete all posts and replies.')) return
    setIsPending(true)

    const response = await fetch(`/api/channels/${channelName}/delete`, { method: 'DELETE' })
    setIsPending(false)

    if (response.ok) {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors duration-200"
    >
      {isPending ? 'Deleting...' : 'Delete Channel'}
    </button>
  )
}
