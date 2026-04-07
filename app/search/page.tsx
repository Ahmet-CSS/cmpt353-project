'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type SearchResult = {
  type: 'post' | 'reply' | 'channel' | 'user'
  id: string
  title?: string
  content?: string
  name?: string
  username?: string
  channelName?: string
  authorName?: string
  score?: number
  createdAt: string
  link: string
}

type SearchResponse = {
  results: SearchResult[]
  total: number
  hasMore: boolean
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const search = async (searchQuery: string, searchType: string, pageNum: number = 1) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        type: searchType,
        page: pageNum.toString(),
        limit: '20'
      })
      const res = await fetch(`/api/search?${params}`)
      if (res.ok) {
        const data: SearchResponse = await res.json()
        if (pageNum === 1) {
          setResults(data.results)
        } else {
          setResults(prev => [...prev, ...data.results])
        }
        setHasMore(data.hasMore)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    search(query, type, 1)
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    search(query, type, nextPage)
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h1>Search ChannelQA</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search query..."
            style={{ flex: 1, padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
          >
            <option value="all">All</option>
            <option value="posts">Posts</option>
            <option value="replies">Replies</option>
            <option value="channels">Channels</option>
            <option value="users">Users</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      <div>
        {results.length === 0 && query && !loading && <p>No results found.</p>}
        {results.map((result, index) => (
          <div key={index} style={{
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: 16,
            marginBottom: 12,
            backgroundColor: '#fafafa'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <span style={{
                  backgroundColor: result.type === 'post' ? '#e3f2fd' :
                                   result.type === 'reply' ? '#f3e5f5' :
                                   result.type === 'channel' ? '#e8f5e8' : '#fff3e0',
                  color: result.type === 'post' ? '#1976d2' :
                         result.type === 'reply' ? '#7b1fa2' :
                         result.type === 'channel' ? '#388e3c' : '#f57c00',
                  padding: '2px 8px',
                  borderRadius: 12,
                  fontSize: '0.8em',
                  fontWeight: 'bold'
                }}>
                  {result.type.toUpperCase()}
                </span>
                {result.score !== undefined && (
                  <span style={{ marginLeft: 8, fontSize: '0.9em', color: '#666' }}>
                    Score: {result.score}
                  </span>
                )}
              </div>
              <span style={{ fontSize: '0.8em', color: '#666' }}>
                {new Date(result.createdAt).toLocaleDateString()}
              </span>
            </div>
            <Link href={result.link} style={{ textDecoration: 'none', color: 'inherit' }}>
              <h3 style={{ margin: '8px 0', color: '#0070f3' }}>
                {result.title || result.name || result.username}
              </h3>
            </Link>
            {result.content && (
              <p style={{ margin: '8px 0', color: '#333' }}>
                {result.content.length > 200 ? `${result.content.substring(0, 200)}...` : result.content}
              </p>
            )}
            {result.authorName && (
              <p style={{ margin: '4px 0', fontSize: '0.9em', color: '#666' }}>
                By {result.authorName}
              </p>
            )}
            {result.channelName && (
              <p style={{ margin: '4px 0', fontSize: '0.9em', color: '#666' }}>
                In {result.channelName}
              </p>
            )}
          </div>
        ))}
        {hasMore && (
          <button
            onClick={loadMore}
            disabled={loading}
            style={{
              display: 'block',
              margin: '20px auto',
              padding: '10px 20px',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        )}
      </div>
    </div>
  )
}