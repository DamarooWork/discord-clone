import { currentProfile, prisma } from '@/shared/lib'
import { NextRequest, NextResponse } from 'next/server'
import { v4 as v4uuid } from 'uuid'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { serverId: string } }
) {
  try {
    
    const profile = await currentProfile()
    if (!profile) {
      return new NextResponse(
        JSON.stringify({
          message: '[SERVER_ID] You need to be logged in to generate an invite link',
        }),
        {
          status: 401,
        }
      )
    }
    const {serverId} = await params

    if (!serverId) {
      return new NextResponse(JSON.stringify({ message: '[SERVER_ID] Server id is required' }), {
        status: 400,
      })
    }
    const server = await prisma.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: v4uuid(),
      },
    })
    if (!server) {
      return new NextResponse(JSON.stringify({ message: '[SERVER_ID] Server not found' }), {
        status: 404,
      })
    }
    return  NextResponse.json(server, {status: 200})
  } catch (e) {
    console.log(e)
    return new NextResponse(JSON.stringify({ message: '[SERVER_ID] Something went wrong' }), {
      status: 500,
    })
  }
}
