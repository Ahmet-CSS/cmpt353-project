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

export default function SearchSection() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const search = async (searchQuery: string, searchType: string, pageNum: number = 1) => {
    if (!searchQuery.trim()) {
      setResults([])
      setShowResults(false)
      return
    }

    setLoading(true)
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        type: searchType,
        page: pageNum.toString(),
        limit: '10' // Smaller limit for homepage
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
        setShowResults(true)
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

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        setPage(1)
        search(query, type, 1)
      } else {
        setResults([])
        setShowResults(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, type])

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Search ChannelQA</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts, replies, channels, and users..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px]"
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
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200 min-w-[100px]"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {showResults && (
        <div className="border-t pt-4">
          {results.length === 0 && !loading && (
            <p className="text-gray-500 text-center py-4">No results found.</p>
          )}

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      result.type === 'post' ? 'bg-blue-100 text-blue-800' :
                      result.type === 'reply' ? 'bg-purple-100 text-purple-800' :
                      result.type === 'channel' ? 'bg-green-100 text-green-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {result.type.toUpperCase()}
                    </span>
                    {result.score !== undefined && (
                      <span className="text-sm text-gray-500">
                        Score: {result.score}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(result.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <Link href={result.link} className="block">
                  <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800 mb-1">
                    {result.title || result.name || result.username}
                  </h3>
                </Link>

                {result.content && (
                  <p className="text-gray-700 mb-2 text-sm">
                    {result.content.length > 150 ? `${result.content.substring(0, 150)}...` : result.content}
                  </p>
                )}

                <div className="flex gap-4 text-xs text-gray-500">
                  {result.authorName && <span>By {result.authorName}</span>}
                  {result.channelName && <span>In {result.channelName}</span>}
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-4">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}