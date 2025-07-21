import { currentProfile, prisma } from '@/shared/lib'
import { MemberRole } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile()
    if (!profile) {
      return NextResponse.json(
        { message: '[SERVER_ID_LEAVE] Unauthorized' },
        {
          status: 401,
        }
      )
    }
    const { serverId } = await params
    if (!serverId) {
      return NextResponse.json(
        { message: '[SERVER_ID_LEAVE] Server id is required' },
        {
          status: 400,
        }
      )
    }

    const server = await prisma.server.update({
      where: {
        id: serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    })

    if (!server) {
      return NextResponse.json(
        { message: '[SERVER_ID_LEAVE] Server not found or you are an admin' },
        {
          status: 404,
        }
      )
    }
    return NextResponse.json(server, { status: 200 })
  } catch (e) {
    console.log(e)
    return NextResponse.json(
      { message: '[SERVER_ID_LEAVE] Something went wrong' },
      {
        status: 500,
      }
    )
  }
}
