import { currentProfile, prisma } from '@/shared/lib'
import { MemberRole } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { serverId: string; channelId: string } }
) {
  try {
    const { serverId, channelId } = await params
    if (!serverId || !channelId) {
      return NextResponse.json(
        {
          message:
            '[SERVER_ID_CHANNELS_ID_DELETE] Server id and channel id are required',
        },
        {
          status: 400,
        }
      )
    }
    const profile = await currentProfile()
    if (!profile) {
      return NextResponse.json(
        { message: '[SERVER_ID_CHANNELS_ID_DELETE] Unauthorized' },
        { status: 404 }
      )
    }
    const server = await prisma.server.findUnique({
      where: {
        id: serverId,
      },
      include: {
        members: {
          where: {
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
    })
    if (!server) {
      return NextResponse.json(
        {
          message:
            '[SERVER_ID_CHANNELS_ID_DELETE] Server not found or you do not have access',
        },
        { status: 404 }
      )
    }

    const channel = await prisma.channel.findUnique({
      where: {
        id: channelId,
        serverId: serverId,
      },
    })
    if (!channel) {
      return NextResponse.json(
        {
          message: '[SERVER_ID_CHANNELS_ID_DELETE] Channel not found',
        },
        { status: 404 }
      )
    }
    if (
      !server.members.some((member) => member.profileId === profile.id) &&
      channel.profileId !== profile.id
    ) {
      return NextResponse.json(
        {
          message:
            '[SERVER_ID_CHANNELS_ID_DELETE] You do not have access to delete this channel',
        },
        { status: 404 }
      )
    }
    if (channel.name === 'General') {
      return NextResponse.json(
        {
          message:
            '[SERVER_ID_CHANNELS_ID_DELETE] Cannot delete General channel',
        },
        { status: 400 }
      )
    }
    await prisma.channel.delete({
      where: {
        id: channel.id,
      },
    })
    return NextResponse.json(server, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json(
      { message: '[SERVER_ID_CHANNELS_ID_DELETE] Something went wrong' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { serverId: string; channelId: string } }
) {
  try {
    const { serverId, channelId } = await params
    if (!serverId || !channelId) {
      return NextResponse.json(
        {
          message:
            '[SERVER_ID_CHANNELS_ID_PATCH] Server id and channel id are required',
        },
        {
          status: 400,
        }
      )
    }
    const { name } = await req.json()
    if (!name) {
      return NextResponse.json(
        {
          message: '[SERVER_ID_CHANNELS_ID_PATCH] Channel name is required',
        },
        {
          status: 400,
        }
      )
    }
    const profile = await currentProfile()
    if (!profile) {
      return NextResponse.json(
        { message: '[SERVER_ID_CHANNELS_ID_PATCH] Unauthorized' },
        { status: 404 }
      )
    }
    const server = await prisma.server.findUnique({
      where: {
        id: serverId,
      },
      include: {
        members: {
          where: {
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
    })
    if (!server) {
      return NextResponse.json(
        {
          message: '[SERVER_ID_CHANNELS_ID_PATCH] Server not found',
        },
        { status: 404 }
      )
    }
    const channel = await prisma.channel.findUnique({
      where: {
        id: channelId,
        serverId: serverId,
      },
    })
    if (!channel) {
      return NextResponse.json(
        {
          message: '[SERVER_ID_CHANNELS_ID_PATCH] Channel not found',
        },
        { status: 404 }
      )
    }
    if (
      !server.members.some((member) => member.profileId === profile.id) &&
      channel.profileId !== profile.id
    ) {
      return NextResponse.json(
        {
          message:
            '[SERVER_ID_CHANNELS_ID_DELETE] You do not have access to edit this channel',
        },
        { status: 404 }
      )
    }
    if (channel.name === 'General') {
      return NextResponse.json(
        {
          message: '[SERVER_ID_CHANNELS_ID_PATCH] Cannot edit General channel',
        },
        { status: 400 }
      )
    }
    await prisma.channel.update({
      where: {
        id: channel.id,
      },
      data: {
        name,
      },
    })
    return NextResponse.json(server, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json(
      { message: '[SERVER_ID_CHANNELS_ID_PATCH] Something went wrong' },
      { status: 500 }
    )
  }
}
