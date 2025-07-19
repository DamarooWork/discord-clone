import { currentProfile, prisma } from "@/shared/lib"
import { NextRequest, NextResponse } from "next/server"

export  async function POST(
  req: NextRequest,
  { params }: { params: { serverId: string } }
) {
  try {
    const { serverId } = await params
    const { name, type } = await req.json()
    if (!serverId) {
      return new Response(JSON.stringify({ message: '[SERVER_ID_CHANNELS] Server id is required' }), {
        status: 400,
      })
    }
    const profile = await currentProfile()
    if (!profile) {
      return new Response(JSON.stringify({ message: '[SERVER_ID_CHANNELS] You need to be logged in to create a channel' }), {
        status: 401,
      })
    }
    const server = await prisma.server.findUnique({
      where: {
        id: serverId,
      },
    })
    if (!server) {
      return new Response(JSON.stringify({ message: '[SERVER_ID_CHANNELS] Server not found' }), {
        status: 404,
      })
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
      return new Response(JSON.stringify({ message: '[SERVER_ID_CHANNELS] Channel not found' }), {
        status: 404,
      })
    }
    return NextResponse.json(channel, {status: 200})
  } catch (e) {
    console.log(e)
    return new Response(JSON.stringify({ message: '[SERVER_ID_CHANNELS] Something went wrong' }), {
      status: 500,
    })
  }
}