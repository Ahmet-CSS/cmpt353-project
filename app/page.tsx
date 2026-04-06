'use client'

export default function HomePage() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome</h1>
      <p>Please select a channel to view its posts:</p>
      <ul>
        <li>
          <a href="/channels/1">Channel 1</a>
        </li>
      </ul>
    </div>
  )
}