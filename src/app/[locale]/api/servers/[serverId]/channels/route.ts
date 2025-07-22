import { currentProfile, prisma } from '@/shared/lib'
import { MemberRole } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: { serverId: string } }
) {
  try {
    const { serverId } = await params
    const { name, type } = await req.json()
    if (!serverId) {
      return NextResponse.json(
        { message: '[SERVER_ID_CHANNELS] Server id is required' },
        {
          status: 400,
        }
      )
    }
    if (!name) {
      return NextResponse.json(
        { message: '[SERVER_ID_CHANNELS] Channel name is required' },
        {
          status: 400,
        }
      )
    }
    if (!type) {
      return NextResponse.json(
        { message: '[SERVER_ID_CHANNELS] Channel type is required' },
        {
          status: 400,
        }
      )
    }
    if (name === 'General') {
      return NextResponse.json(
        { message: '[SERVER_ID_CHANNELS] Channel name cannot be "General"' },
        {
          status: 400,
        }
      )
    }

    const profile = await currentProfile()
    if (!profile) {
      return NextResponse.json( { message: '[SERVER_ID_CHANNELS] Profile not found' }, { status: 404 })
    }
    const server = await prisma.server.findUnique({
      where: {
        id: serverId,
        members:{
          some: {
            profileId: profile.id,
            role:{
              in: [
                MemberRole.ADMIN,
                MemberRole.MODERATOR,
              ]
            }
          },
        }
      },
    })
    if (!server) {
      return NextResponse.json( { message: '[SERVER_ID_CHANNELS] Server not found or you do not have access' }, { status: 404 })
    }
    const channel = await prisma.channel.create({
      data: {
        name,
        type,
        serverId: server.id,
        profileId: profile.id,
      },
    })
    if (!channel) {
      return NextResponse.json( { message: '[SERVER_ID_CHANNELS] Something went wrong' }, { status: 500 })
    }
      
    
    return NextResponse.json(channel, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json( { message: '[SERVER_ID_CHANNELS] Something went wrong' }, { status: 500 })
  }
}
