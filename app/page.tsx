import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function HomePage() {
  const user = await getCurrentUser()
  const channels = await prisma.channel.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  const visibleChannels = channels.filter((channel) => channel.name?.trim().length > 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black text-gray-900 mb-6 tracking-tight">
            Welcome
          </h1>
          <p className="text-xl text-gray-600 mb-8 font-medium">
            Please select a channel to view its posts:
          </p>
        </div>

        {user?.role === 'admin' && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-l-4 border-purple-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Actions</h2>
            <Link
              href="/channels/create"
              className="inline-block px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              + Create New Channel
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleChannels.map((channel) => (
            <div
              key={channel.id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <Link
                href={`/channels/${encodeURIComponent(channel.name)}`}
                className="block text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                {channel.name}
              </Link>
              <p className="text-gray-500 mt-2">{channel.description}</p>
            </div>
          ))}
        </div>

        {channels.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No channels yet.</p>
            {user?.role === 'admin' && (
              <p className="text-gray-600 mt-2">
                <Link href="/channels/create" className="text-blue-600 hover:text-blue-800 font-semibold">
                  Create the first channel
                </Link>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}