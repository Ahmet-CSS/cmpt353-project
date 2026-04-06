'use client'

import { FormEvent, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface CreateReplyFormProps {
  postId: string
}

export default function CreateReplyForm({ postId }: CreateReplyFormProps) {
  const [body, setBody] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const trimmedBody = body.trim()

    if (!trimmedBody) {
      setError('Reply body is required.')
      return
    }

    let attachmentPath: string | undefined
    let mimeType: string | undefined
    let sizeBytes: number | undefined

    if (file) {
      const formData = new FormData()
      formData.append('file', file)

      const uploadResponse = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        setError('Failed to upload image. Please try again.')
        return
      }

      const uploadData = await uploadResponse.json()
      attachmentPath = uploadData.path
      mimeType = uploadData.mimeType
      sizeBytes = uploadData.sizeBytes
    }

    startTransition(async () => {
      const response = await fetch(`/api/posts/${postId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: trimmedBody, attachmentPath, mimeType, sizeBytes }),
      })

      if (!response.ok) {
        setError('Failed to create reply. Please try again.')
        return
      }

      setBody('')
      setFile(null)
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, maxWidth: 620 }}>
      <div>
        <label htmlFor="reply-body" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
          Reply
        </label>
        <textarea
          id="reply-body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Write your reply here"
          rows={4}
          style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #ccc' }}
        />
      </div>

      <div>
        <label htmlFor="reply-file" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
          Screenshot (optional)
        </label>
        <input
          id="reply-file"
          type="file"
          accept="image/*"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #ccc' }}
        />
      </div>

      {error ? (
        <p style={{ color: 'red', margin: 0 }}>{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        style={{
          padding: '10px 16px',
          borderRadius: 6,
          border: 'none',
          backgroundColor: '#0070f3',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        {isPending ? 'Posting…' : 'Post reply'}
      </button>
    </form>
  )
}