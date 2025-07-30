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
      .json({ message: ' [MESSAGES_POST] Method not allowed' })
  }
  try {
    const profile = await currentProfilePages(req)
    if (!profile) {
      return res.status(401).json({ message: ' [MESSAGES_POST] Unauthorized' })
    }
    const { content, fileUrl, fileType, fileName } = req.body
    const { channelId, serverId } = req.query
    if (!serverId) {
      return res
        .status(400)
        .json({ message: ' [MESSAGES_POST] Server id is required' })
    }
    if (!channelId) {
      return res
        .status(400)
        .json({ message: ' [MESSAGES_POST] Channel id is required' })
    }
    if (!content) {
      return res
        .status(400)
        .json({ message: ' [MESSAGES_POST] Content is required' })
    }
    const server = await prisma.server.findUnique({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id as string,
          },
        },
      },
      include: {
        members: true,
      },
    })
    if (!server) {
      return res
        .status(404)
        .json({ message: ' [MESSAGES_POST] Server not found' })
    }

    const channel = await prisma.channel.findUnique({
      where: {
        id: channelId as string,
        serverId: server.id as string,
      },
    })
    if (!channel) {
      return res
        .status(404)
        .json({ message: ' [MESSAGES_POST] Channel not found' })
    }
    const member = server.members.find(
      (member) => member.profileId === profile.id
    )

    if (!member) {
      return res
        .status(404)
        .json({ message: '[MESSAGES_POST] Member not found' })
    }
    const message = await prisma.message.create({
      data: {
        content,
        channelId: channel.id as string,
        memberId: member.id as string,
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
      },
    })
    const channelKey = `chat:${channelId}:messages`
    res?.socket?.server?.io?.emit(channelKey, message)
    return res.status(200).json({ message })
  } catch (e) {
    console.log('[MESSAGES_POST]', e)
    return res.status(500).json({ message: 'Internal error', error: e })
  }
}
