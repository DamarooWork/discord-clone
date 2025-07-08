import { prisma } from '@/shared/lib/prisma'
import { auth, currentUser } from '@clerk/nextjs/server'
export async function initialProfile() {
  const user = await currentUser()
  if (!user) {
     auth.protect()
     return null
  }
  const profile = await prisma.profile.findUnique({
    where: {
      userId: user.id,
    },
  })
  if (profile) {
    return profile
  }

  const newProfile = await prisma.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
      email: user.emailAddresses?.[0]?.emailAddress ?? '',
      imageUrl: user.imageUrl ?? '',
    },
  })
  return newProfile
}
