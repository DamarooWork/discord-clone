import { currentProfilePages, prisma } from '@/shared/lib'
import { NextApiResponseServerIo } from '@/shared/types'
import { MessageFileType } from '@prisma/client'
import { NextApiRequest } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ message: ' [DIRECT_MESSAGES_POST] Method not allowed' })
  }
  try {
    const profile = await currentProfilePages(req)
    if (!profile) {
      return res
        .status(401)
        .json({ message: ' [DIRECT_MESSAGES_POST] Unauthorized' })
    }
    const { content, fileUrl, fileType, fileName } = req.body
    const { conversationId } = req.query
    if (!conversationId) {
      return res.status(400).json({
        message: ' [DIRECT_MESSAGES_POST] Conversation id is required',
      })
    }

    if (!content) {
      return res
        .status(400)
        .json({ message: ' [DIRECT_MESSAGES_POST] Content is required' })
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
        .json({ message: ' [DIRECT_MESSAGES_POST] Conversation not found' })
    }
    const memberId =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne.id
        : conversation.memberTwo.id

    const directMessage = await prisma.directMessage.create({
      data: {
        content,
        memberId,
        conversationId: conversationId as string,
        fileUrl,
        fileType: (fileType as MessageFileType) || null,
        fileName,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
        conversation: {
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
        },
      },
    })
    if (!directMessage) {
      return res
        .status(404)
        .json({ message: '[DIRECT_MESSAGES_POST] Direct message not created' })
    }
    const conversationKey = `chat:${conversationId}:messages`
    res?.socket?.server?.io?.emit(conversationKey, directMessage)
    return res.status(200).json(directMessage)
  } catch (e) {
    console.log('[DIRECT_MESSAGES_POST]', e)
    return res.status(500).json({ message: 'Internal error', error: e })
  }
}
