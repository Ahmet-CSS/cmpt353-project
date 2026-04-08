'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const trimmedDisplayName = displayName.trim()
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()

    if (!trimmedDisplayName || !trimmedEmail || !trimmedPassword) {
      setError('Display name, email, and password are required.')
      return
    }

    setIsPending(true)

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName: trimmedDisplayName, email: trimmedEmail, password: trimmedPassword }),
    })

    setIsPending(false)

    if (!response.ok) {
      const data = await response.json()
      setError(data?.error || 'Failed to sign up. Please try again.')
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16, marginTop: 20 }}>
        <label>
          Display name
          <input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Display name"
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', marginTop: 8 }}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', marginTop: 8 }}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', marginTop: 8 }}
          />
        </label>
        {error ? <p style={{ color: 'red' }}>{error}</p> : null}
        <button
          type="submit"
          disabled={isPending}
          style={{ padding: '10px 16px', borderRadius: 6, border: 'none', backgroundColor: '#0070f3', color: '#fff', cursor: 'pointer' }}
        >
          {isPending ? 'Signing up…' : 'Sign up'}
        </button>
      </form>
    </div>
  )
}
