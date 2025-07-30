import { currentProfile, prisma } from '@/shared/lib'
import { MESSAGES_BATCH } from '@/shared/lib/contants'
import { DirectMessage, Message } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const profile = await currentProfile()
    if (!profile) {
      return NextResponse.json({ message: 'Unauthorized', status: 401 })
    }
    const { searchParams } = new URL(req.url)
    const cursor = searchParams.get('cursor')
    const conversationId = searchParams.get('conversationId')

    if (!conversationId) {
      return NextResponse.json({
        message: '[MESSAGES_GET] Conversation id is required',
        status: 400,
      })
    }

    let directMessages: DirectMessage[] = []
    if (cursor) {
      directMessages = await prisma.directMessage.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId: conversationId as string,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } else {
      directMessages = await prisma.directMessage.findMany({
        take: MESSAGES_BATCH,
        where: {
          conversationId: conversationId as string,
          deleted: false,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }

    let nextCursor: string | null = null
    if (directMessages.length === MESSAGES_BATCH) {
      nextCursor = directMessages[MESSAGES_BATCH - 1].id
    }

    return NextResponse.json({ items: directMessages, nextCursor })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Internal error', status: 500 })
  }
}
