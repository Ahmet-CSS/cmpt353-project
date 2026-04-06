'use client'

import { FormEvent, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface AddAttachmentFormProps {
  postId: string
}

export default function AddAttachmentForm({ postId }: AddAttachmentFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!file) {
      setError('Please select an image file.')
      return
    }

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
    const { path, mimeType, sizeBytes } = uploadData

    startTransition(async () => {
      const response = await fetch(`/api/posts/${postId}/attachments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, mimeType, sizeBytes }),
      })

      if (!response.ok) {
        setError('Failed to add attachment. Please try again.')
        return
      }

      setFile(null)
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, maxWidth: 620 }}>
      <div>
        <label htmlFor="attachment-file" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
          Add Screenshot
        </label>
        <input
          id="attachment-file"
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
        disabled={isPending || !file}
        style={{
          padding: '10px 16px',
          borderRadius: 6,
          border: 'none',
          backgroundColor: '#0070f3',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        {isPending ? 'Uploading…' : 'Add Screenshot'}
      </button>
    </form>
  )
}