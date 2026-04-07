'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface VoteControlsProps {
  targetType: 'post' | 'reply'
  targetId: number
  currentVote: number
  score: number
  disabled?: boolean
}

export default function VoteControls({ targetType, targetId, currentVote, score, disabled = false }: VoteControlsProps) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const endpoint = targetType === 'post' ? `/api/posts/${targetId}/votes` : `/api/replies/${targetId}/votes`

  const handleVote = async (value: number) => {
    if (disabled || isPending) return
    setIsPending(true)

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    })

    setIsPending(false)
    if (response.ok) {
      router.refresh()
    }
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <button
        type="button"
        onClick={() => handleVote(currentVote === 1 ? 0 : 1)}
        disabled={disabled || isPending}
        style={{
          padding: '6px 10px',
          borderRadius: 6,
          border: '1px solid #ccc',
          backgroundColor: currentVote === 1 ? '#d1fae5' : '#fff',
          color: '#111',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        ▲
      </button>
      <span style={{ minWidth: 40, textAlign: 'center', fontWeight: 600 }}>{score}</span>
      <button
        type="button"
        onClick={() => handleVote(currentVote === -1 ? 0 : -1)}
        disabled={disabled || isPending}
        style={{
          padding: '6px 10px',
          borderRadius: 6,
          border: '1px solid #ccc',
          backgroundColor: currentVote === -1 ? '#fee2e2' : '#fff',
          color: '#111',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        ▼
      </button>
    </div>
  )
}
