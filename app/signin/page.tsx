'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SigninPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()

    if (!trimmedEmail || !trimmedPassword) {
      setError('Email and password are required.')
      return
    }

    setIsPending(true)

    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
    })

    setIsPending(false)

    if (!response.ok) {
      const data = await response.json()
      setError(data?.error || 'Failed to sign in. Please try again.')
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <h1>Sign in</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16, marginTop: 20 }}>
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
          {isPending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
