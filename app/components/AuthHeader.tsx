import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import SignOutButton from './SignOutButton'

export default async function AuthHeader() {
  const user = await getCurrentUser()

  return (
    <header
      style={{
        width: '100%',
        padding: 20,
        borderBottom: '1px solid #e2e8f0',
        marginBottom: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Link href="/" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 600 }}>
          Home
        </Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {user ? (
          <>
            <span style={{ color: '#333' }}>
              Signed in as <strong>{user.displayName}</strong> ({user.role})
            </span>
            <SignOutButton />
          </>
        ) : (
          <>
            <Link href="/signin" style={{ color: '#0070f3', textDecoration: 'none' }}>
              Sign in
            </Link>
            <Link href="/signup" style={{ color: '#0070f3', textDecoration: 'none' }}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
