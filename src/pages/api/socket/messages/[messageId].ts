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
      .json({ message: ' [MESSAGES_ID] Method not allowed' })
  }

  try {
    const profile = await currentProfilePages(req)
    if (!profile) {
      return res.status(401).json({ message: ' [MESSAGES_ID] Unauthorized' })
    }
    const { content } = req.body
    const { channelId, serverId, messageId } = req.query
    if (!messageId) {
      return res
        .status(400)
        .json({ message: ' [MESSAGES_ID] Message id is required' })
    }
    if (!channelId) {
      return res
        .status(400)
        .json({ message: ' [MESSAGES_ID] Channel id is required' })
    }
    if (!serverId) {
      return res
        .status(400)
        .json({ message: ' [MESSAGES_ID] Server id is required' })
    }
    const server = await prisma.server.findUnique({
      where: {
        id: serverId as string,
      },
      include: {
        members: true,
      },
    })
    if (!server) {
      return res
        .status(404)
        .json({ message: ' [MESSAGES_ID] Server not found' })
    }
    const member = server.members.find(
      (member) => member.profileId === profile.id
    )

    if (!member) {
      return res
        .status(404)
        .json({ message: ' [MESSAGES_ID] Member not found' })
    }

    let message = await prisma.message.findFirst({
      where: {
        id: messageId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    })
    if (!message) {
      return res
        .status(404)
        .json({ message: ' [MESSAGES_ID] Message not found' })
    }

    if (req.method === 'PATCH') {
      message = await prisma.message.update({
        where: {
          id: messageId as string,
          channelId: channelId as string,
          memberId: member.id,
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
      const isAdmin = member.role === MemberRole.ADMIN
      const isModerator = member.role === MemberRole.MODERATOR
      const isOwner = member.id === message.member.id

      const canDeleteMessage =
        !message.deleted && (isAdmin || isOwner || isModerator)
      if (!canDeleteMessage) {
        return res
          .status(403)
          .json({ message: '[MESSAGES_ID] You can not delete this message' })
      }
      message = await prisma.message.update({
        where: {
          id: messageId as string,
          
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
    const updateKey = `chat:${channelId}:messages:update`
    res?.socket?.server?.io?.emit(updateKey, message)
    return res.status(200).json(message)
  } catch (e) {
    console.log(e)
    return res
      .status(500)
      .json({ message: '[MESSAGES_ID] Internal error', error: e })
  }
}
