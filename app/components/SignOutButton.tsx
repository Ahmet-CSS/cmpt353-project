'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignOutButton() {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    setIsPending(true)
    const response = await fetch('/api/auth/signout', { method: 'POST' })
    setIsPending(false)

    if (response.ok) {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isPending}
      style={{
        marginLeft: 12,
        padding: '8px 12px',
        borderRadius: 6,
        border: '1px solid #ccc',
        backgroundColor: '#fff',
        color: '#111',
        cursor: 'pointer',
      }}
    >
      {isPending ? 'Signing out…' : 'Sign out'}
    </button>
  )
}
