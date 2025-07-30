import { currentProfile, prisma } from '@/shared/lib'
import { MESSAGES_BATCH } from '@/shared/lib/contants'
import {  Message } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const profile = await currentProfile()
    if (!profile) {
      return NextResponse.json({ message: 'Unauthorized', status: 401 })
    }
    const { searchParams } = new URL(req.url)
    const cursor = searchParams.get('cursor')
    const channelId = searchParams.get('channelId')

    if (!channelId) {
      return NextResponse.json({
        message: '[MESSAGES_GET] Channel id is required',
        status: 400,
      })
    }
    let messages: Message[] = []
    if (cursor) {
      messages = await prisma.message.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId: channelId as string,
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
      messages = await prisma.message.findMany({
        take: MESSAGES_BATCH,
        where: {
          channelId: channelId,
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
    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id
    }

    return NextResponse.json({ items: messages, nextCursor })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Internal error', status: 500 })
  }
}


