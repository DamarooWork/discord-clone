import { currentProfile, prisma } from '@/shared/lib'
import { MESSAGES_BATCH } from '@/shared/lib/contants'
import { MemberRole, Message } from '@prisma/client'
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

export async function DELETE(req: Request, res: NextResponse) {
  try {
    const profile = await currentProfile()
    if (!profile) {
      return NextResponse.json({ message: 'Unauthorized', status: 401 })
    }
    const { searchParams } = new URL(req.url)
    const channelId = searchParams.get('channelId')
    const serverId = searchParams.get('serverId')
    const body = await req.json()
    const { messageId } = body
    if (!messageId) {
      return NextResponse.json({
        message: '[MESSAGES_DELETE] Message id is required',
        status: 400,
      })
    }
    if (!channelId) {
      return NextResponse.json({
        message: '[MESSAGES_DELETE] Channel id is required',
        status: 400,
      })
    }
    if (!serverId) {
      return NextResponse.json({
        message: '[MESSAGES_DELETE] Server id is required',
        status: 400,
      })
    }
    const member = await prisma.member.findFirst({
      where: {
        profileId: profile.id,
        serverId: serverId as string,
      },
    
    })
    if (!member) {
      return NextResponse.json({
        message: '[MESSAGES_DELETE] Member not found',
        status: 404,
      })
    }
    const message = await prisma.message.findFirst({
      where: {
        id: messageId as string,
      },
      
    })
    if (
      message?.memberId !== member.id &&
      member.role !== MemberRole.ADMIN &&
      member.role !== MemberRole.MODERATOR
    ) {
      return NextResponse.json({
        message: '[MESSAGES_DELETE] You can not delete this message',
        status: 403,
      })
    }
    const updatedMessage = await prisma.message.update({
      where: {
        id: messageId as string,
      },
      data: {
        deleted: true,
      },
    })
    if (!updatedMessage) {
      return NextResponse.json({
        message: '[MESSAGES_DELETE] Message not found',
        status: 404,
      })
    }
    return NextResponse.json({ message: updatedMessage })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Internal error', status: 500 })
  }
}
