import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: 'Access denied' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const value = Number(body.value)
  if (![1, -1, 0].includes(value)) {
    return NextResponse.json({ error: 'Invalid vote value' }, { status: 400 })
  }

  const replyId = Number(id)
  const existingVote = await prisma.vote.findUnique({
    where: { userId_replyId: { userId: user.id, replyId } },
  })

  if (value === 0 || existingVote?.value === value) {
    if (existingVote) {
      await prisma.vote.delete({ where: { id: existingVote.id } })
    }
  } else if (!existingVote) {
    await prisma.vote.create({
      data: {
        value,
        userId: user.id,
        replyId,
      },
    })
  } else {
    await prisma.vote.update({
      where: { id: existingVote.id },
      data: { value },
    })
  }

  const scoreResult = await prisma.vote.aggregate({
    where: { replyId },
    _sum: { value: true },
  })

  return NextResponse.json({ score: scoreResult._sum.value ?? 0 })
}
