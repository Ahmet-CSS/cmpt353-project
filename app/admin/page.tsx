import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import DeleteChannelButton from '@/app/components/DeleteChannelButton'
import DeleteUserButton from '@/app/components/DeleteUserButton'

export default async function AdminDashboardPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-10 text-center">
          <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-gray-600">Access denied. Admins only.</p>
          <Link href="/" className="mt-6 inline-block text-blue-600 hover:text-blue-800">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const [channels, users] = await Promise.all([
    prisma.channel.findMany({
      orderBy: { createdAt: 'desc' },
      include: { createdBy: true },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="mt-2 text-gray-600">Manage channels, users, and platform actions from one place.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/channels/create"
                className="px-5 py-3 bg-purple-600 text-white rounded-2xl font-semibold hover:bg-purple-700 transition"
              >
                Create New Channel
              </Link>
              <Link
                href="/"
                className="px-5 py-3 border border-slate-300 rounded-2xl text-slate-700 hover:bg-slate-100 transition"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900">Channels</h2>
            <p className="mt-2 text-sm text-slate-500">Total channels: {channels.length}</p>
          </div>

          <div className="space-y-0">
            {channels.map((channel) => (
              <div
                key={channel.id}
                className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 px-8 py-6 even:bg-slate-50"
              >
                <div>
                  <Link href={`/channels/${encodeURIComponent(channel.name)}`} className="text-xl font-semibold text-blue-600 hover:text-blue-800">
                    {channel.name}
                  </Link>
                  <p className="text-slate-600 mt-2">{channel.description || 'No description provided.'}</p>
                  <p className="mt-3 text-sm text-slate-500">
                    Created by {channel.createdBy.displayName} on {new Date(channel.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center justify-end gap-3">
                  <DeleteChannelButton channelName={channel.name} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900">Users</h2>
            <p className="mt-2 text-sm text-slate-500">Total users: {users.length}</p>
          </div>

          <div className="space-y-0">
            {users.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 px-8 py-6 even:bg-slate-50"
              >
                <div>
                  <p className="text-xl font-semibold text-slate-900">{user.displayName}</p>
                  <p className="text-slate-600 mt-2">{user.email}</p>
                  <p className="mt-2 text-sm text-slate-500">Role: {user.role}</p>
                  <p className="mt-3 text-sm text-slate-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center justify-end gap-3">
                  {currentUser.id !== user.id ? (
                    <DeleteUserButton userId={user.id} userName={user.displayName} />
                  ) : (
                    <span className="text-sm text-slate-500">Current admin</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
