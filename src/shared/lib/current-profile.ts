import { auth, currentUser } from '@clerk/nextjs/server'
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
  const user = await currentUser()
  if (!user) {
    auth.protect()
    return null
  }
  if (
    user.username !== profile?.name ||
    user.emailAddresses?.[0]?.emailAddress !== profile?.email ||
    user.imageUrl !== profile?.imageUrl
  ) {
    await prisma.profile.update({
      where: {
        userId,
      },
      data: {
        name:
          user.username ??
          `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() ??
          '',
        email: user.emailAddresses?.[0]?.emailAddress ?? '',
        imageUrl: user.imageUrl ?? '',
      },
    })
  }

  return profile
}
