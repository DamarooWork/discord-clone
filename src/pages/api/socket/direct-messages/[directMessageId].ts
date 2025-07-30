import { currentProfilePages, prisma } from '@/shared/lib'
import { NextApiResponseServerIo } from '@/shared/types'
import { MemberRole } from '@prisma/client'
import { NextApiRequest } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'PATCH' && req.method !== 'DELETE') {
    return res
      .status(405)
      .json({ message: ' [DIRECT_MESSAGES_ID] Method not allowed' })
  }

  try {
    const profile = await currentProfilePages(req)
    if (!profile) {
      return res
        .status(401)
        .json({ message: ' [DIRECT_MESSAGES_ID] Unauthorized' })
    }
    const { content } = req.body
    const { conversationId, directMessageId } = req.query

    if (!directMessageId) {
      return res.status(400).json({
        message: ' [DIRECT_MESSAGES_ID] Direct message id is required',
      })
    }
    if (!conversationId) {
      return res
        .status(400)
        .json({ message: ' [DIRECT_MESSAGES_ID] Conversation id is required' })
    }
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    })
    if (!conversation) {
      return res
        .status(404)
        .json({ message: ' [DIRECT_MESSAGES_ID] Conversation not found' })
    }
    const memberId =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne.id
        : conversation.memberTwo.id

    let directMessage = await prisma.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        memberId,
        conversationId: conversation.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    })
    if (!directMessage || directMessage.deleted) {
      return res
        .status(404)
        .json({ message: ' [DIRECT_MESSAGES_ID] Message not found' })
    }

    if (req.method === 'PATCH') {
      directMessage = await prisma.directMessage.update({
        where: {
          id: directMessageId as string,
          memberId,
          deleted: false,
        },
        data: {
          content,
          updatedAt: new Date(),
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      })
    }
    if (req.method === 'DELETE') {
      const canDeleteMessage =
        !directMessage.deleted && profile.id === directMessage.member.profileId

      if (!canDeleteMessage) {
        return res.status(403).json({
          message: '[DIRECT_MESSAGES_ID] You can not delete this message',
        })
      }
      directMessage = await prisma.directMessage.update({
        where: {
          id: directMessageId as string,
          memberId,
        },
        data: {
          deleted: true,
          fileUrl: null,
          fileType: null,
          fileName: null,
          updatedAt: new Date(),
          content: 'This message has been deleted.',
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      })
    }
    const updateKey = `chat:${conversationId}:messages:update`
    res?.socket?.server?.io?.emit(updateKey, directMessage)
    return res.status(200).json(directMessage)
  } catch (e) {
    console.log(e)
    return res
      .status(500)
      .json({ message: '[DIRECT_MESSAGES_ID] Internal error', error: e })
  }
}
