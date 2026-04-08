'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeleteUserButtonProps {
  userId: number
  userName: string
}

export default function DeleteUserButton({ userId, userName }: DeleteUserButtonProps) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Delete user "${userName}" permanently? This will delete all their posts, replies, and channels.`)) return
    setIsPending(true)

    const response = await fetch(`/api/users/${userId}/delete`, { method: 'DELETE' })
    setIsPending(false)

    if (response.ok) {
      router.push('/')
      router.refresh()
    } else {
      const error = await response.json()
      alert(`Error: ${error.error}`)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors duration-200"
    >
      {isPending ? 'Deleting...' : 'Delete User'}
    </button>
  )
}