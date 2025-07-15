import { currentProfile, prisma } from '@/shared/lib'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { serverId: string; memberId: string } }
) {
  try {
    const { serverId, memberId } = await params
    if (!serverId || !memberId) {
      return new NextResponse(
        JSON.stringify({
          message: '[SERVER_MEMBER_ID_PATCH] Server id and member id is required',
        }),
        {
          status: 400,
        }
      )
    }
    const member = await prisma.member.findUnique({
      where: {
        id: memberId,
        serverId: serverId,
      },
    })
    if (!member) {
      return new NextResponse(
        JSON.stringify({
          message: '[SERVER_MEMBER_ID_PATCH] Member not found',
        }),
        {
          status: 404,
        }
      )
    }
    const profile = await currentProfile()
    if (!profile) {
      return new NextResponse(
        JSON.stringify({
          message:
            '[SERVER_MEMBER_ID_PATCH] You need to be logged in to update a member role',
        }),
        {
          status: 401,
        }
      )
    }
    
    const { role } = await req.json()
    if (!role) {
      return new NextResponse(
        JSON.stringify({
          message: '[SERVER_MEMBER_ID_PATCH] Role is required',
        }),
        {
          status: 400,
        }
      )
    }
    const server = await prisma.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
        members: {
          some: {
            id: memberId,
          },
        },
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
            },
            data: {
              role: role,
            },
          },
        },
      },
      include:{
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      }
    })
    if (!server) {
      return new NextResponse(JSON.stringify({ message: '[SERVER_MEMBER_ID_PATCH] Server not found' }), {
        status: 404,
      })
    }
    return NextResponse.json(server, {status: 200})
  } catch (e) {
    console.log(e)
    return new NextResponse(
      JSON.stringify({ message: '[SERVER_MEMBER_ID_PATCH] Something went wrong' }),
      {
        status: 500,
      }
    )
  }
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: { serverId: string; memberId: string } }
) {
  try {
    const { serverId, memberId } = await params
    if (!serverId || !memberId) {
      return new NextResponse(
        JSON.stringify({
          message: '[SERVER_MEMBER_ID_DETELE] Server id and member id is required',
        }),
        {
          status: 400,
        }
      )
    }
    const profile = await currentProfile()
    if (!profile) {
      return new NextResponse(
        JSON.stringify({
          message:
            '[SERVER_MEMBER_ID_DETELE] You need to be logged in to update a member role',
        }),
        {
          status: 401,
        }
      )
    }
    await prisma.member.delete({
      where: {
        id: memberId,
        serverId: serverId,
      },
    })
    const server = await prisma.server.findUnique({
      where: {
        id: serverId,
        profileId: profile.id,
        members:{
          none:{
            id: memberId,
          }
        }
      },
      include:{
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      }
    })
    if (!server) {
      return new NextResponse(JSON.stringify({ message: '[SERVER_MEMBER_ID_DETELE] Server not found' }), {
        status: 404,
      })
    }
    return NextResponse.json(server, {status: 200})
  } catch (e) {
    console.log(e)
    return new NextResponse(
      JSON.stringify({ message: '[SERVER_MEMBER_ID_DETELE] Something went wrong' }),
      {
        status: 500,
      }
    )
  }
}
