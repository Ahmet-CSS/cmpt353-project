'use client'

import { FormEvent, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface CreatePostFormProps {
  channelId: string
}

export default function CreatePostForm({ channelId }: CreatePostFormProps) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const trimmedTitle = title.trim()
    const trimmedBody = body.trim()

    if (!trimmedTitle || !trimmedBody) {
      setError('Title and body are required.')
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
      const response = await fetch(`/api/channels/${channelId}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmedTitle, body: trimmedBody, attachmentPath, mimeType, sizeBytes }),
      })

      if (!response.ok) {
        setError('Failed to create post. Please try again.')
        return
      }

      setTitle('')
      setBody('')
      setFile(null)
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, maxWidth: 620 }}>
      <div>
        <label htmlFor="post-title" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
          Title
        </label>
        <input
          id="post-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Post title"
          style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #ccc' }}
        />
      </div>

      <div>
        <label htmlFor="post-body" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
          Body
        </label>
        <textarea
          id="post-body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Write your post content here"
          rows={5}
          style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #ccc' }}
        />
      </div>

      <div>
        <label htmlFor="post-file" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
          Screenshot (optional)
        </label>
        <input
          id="post-file"
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
        {isPending ? 'Creating…' : 'Create post'}
      </button>
    </form>
  )
}
