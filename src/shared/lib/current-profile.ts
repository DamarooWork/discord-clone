import { auth } from '@clerk/nextjs/server'
import { prisma } from './prisma'

export async function currentProfile() {
  const { userId } = await auth()
  if (!userId) {
    return null
  }
  const profile = await prisma.profile.findUnique({
    where: {
      userId,
    },
  })
  return profile
}
