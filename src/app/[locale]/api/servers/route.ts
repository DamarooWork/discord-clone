import { CurrentProfile } from '@/shared/lib/current-profile'
import { prisma } from '@/shared/lib/prisma'
import { v4 as uuidv4 } from 'uuid'
import { NextRequest, NextResponse } from 'next/server'
import { ChannelType, MemberRole } from '@prisma/client'

export async function POST(req: NextRequest) {
  try {
    const { name, imageUrl } = await req.json()
    const profile = await CurrentProfile()
    if (!profile) {
      return new NextResponse('Unauthorized', {
        status: 401,
      })
    }
    const server = await prisma.server.create({
      data: {
        name,
        imageUrl,
        profileId: profile.id,
        inviteCode: uuidv4(),
        channels: {
          create: [
            {
              name: 'General',
              profileId: profile.id,
              type: ChannelType.TEXT,
            },
            {
              name: 'Voice chat',
              profileId: profile.id,
              type: ChannelType.VOICE,
            },
          ],
        },
        members: {
          create: [
            {
              profileId: profile.id,
              role: MemberRole.ADMIN,
            },
          ],
        },
      },
    })
    return NextResponse.json(server, {
      status: 200,
    })
  } catch (e) {
    console.log('[SERVERS_POST]', e)
    return new NextResponse(JSON.stringify(e), {
      status: 500,
    })
  }
}
