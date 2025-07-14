import { currentProfile, prisma } from '@/shared/lib'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile()
    if (!profile) {
      return new NextResponse('[SERVER_ID_PATCH] Unauthorized', {
        status: 401,
      })
    }
    const serverId = await params.serverId
    if (!serverId) {
      return new NextResponse('[SERVER_ID_PATCH] Invalid server id', {
        status: 400,
      })
    }
    const { name, imageUrl } = await req.json()
    const server = await prisma.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    })
    if (!server) {
      return new NextResponse(
        '[SERVER_ID_PATCH] Server not found or you are not an admin',
        {
          status: 404,
        }
      )
    }
    return NextResponse.json(server, { status: 200 })
  } catch (e) {
    console.log('[SERVER_ID_PATCH]', e)
    return new NextResponse(JSON.stringify(e), {
      status: 500,
    })
  }
}
