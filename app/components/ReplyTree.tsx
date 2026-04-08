'use client'

import { useState } from 'react'
import CreateReplyForm from '@/app/posts/[id]/CreateReplyForm'
import DeleteReplyButton from './DeleteReplyButton'
import VoteControls from './VoteControls'

interface ReplyNode {
  id: number
  body: string
  createdAt: string
  author: {
    displayName: string
  }
  attachments: Array<{ id: number; path: string }>
  childReplies: ReplyNode[]
  score: number
  currentUserVote: number
}

interface ReplyTreeProps {
  postId: number
  replies: ReplyNode[]
  disabled: boolean
  isAdmin?: boolean
  depth?: number
}

export default function ReplyTree({ postId, replies, disabled, isAdmin = false, depth = 0 }: ReplyTreeProps) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: depth === 0 ? 0 : '12px 0 0 0' }}>
      {replies.map((reply) => (
        <ReplyNodeItem
          key={reply.id}
          postId={postId}
          reply={reply}
          disabled={disabled}
          isAdmin={isAdmin}
          depth={depth}
        />
      ))}
    </ul>
  )
}

function ReplyNodeItem({ postId, reply, disabled, isAdmin, depth }: { postId: number; reply: ReplyNode; disabled: boolean; isAdmin: boolean; depth: number }) {
  const [showReplyForm, setShowReplyForm] = useState(false)

  return (
    <li style={{ marginBottom: 18, marginLeft: depth * 24, padding: 18, border: '1px solid #e2e8f0', borderRadius: 10, backgroundColor: '#f9fafb' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
            <span style={{ color: '#555', fontSize: 13 }}>{new Date(reply.createdAt).toLocaleString()}</span>
            <span style={{ color: '#666', fontSize: 13 }}>Author: {reply.author.displayName}</span>
          </div>
          <p style={{ margin: '12px 0 0', whiteSpace: 'pre-wrap' }}>{reply.body}</p>
          {reply.attachments.length > 0 && (
            <div style={{ marginTop: 12 }}>
              {reply.attachments.map((attachment) => (
                <img
                  key={attachment.id}
                  src={attachment.path}
                  alt="Reply screenshot"
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: 6 }}
                />
              ))}
            </div>
          )}
        </div>

        <VoteControls
          targetType="reply"
          targetId={reply.id}
          currentVote={reply.currentUserVote}
          score={reply.score}
          disabled={disabled}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
        {!disabled ? (
          <button
            type="button"
            onClick={() => setShowReplyForm((value) => !value)}
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              cursor: 'pointer',
            }}
          >
            {showReplyForm ? 'Cancel' : 'Reply'}
          </button>
        ) : null}
        {isAdmin && <DeleteReplyButton replyId={reply.id} />}
      </div>

      {showReplyForm ? (
        <div style={{ marginTop: 16 }}>
          <CreateReplyForm postId={String(postId)} parentReplyId={reply.id} disabled={disabled} />
        </div>
      ) : null}

      {reply.childReplies.length > 0 ? (
        <ReplyTree postId={postId} replies={reply.childReplies} disabled={disabled} isAdmin={isAdmin} depth={depth + 1} />
      ) : null}
    </li>
  )
}
