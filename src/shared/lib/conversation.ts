import { prisma } from './prisma'

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            memberOneId,
          },
          {
            memberTwoId,
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    })
  } catch (error) {
    console.log(error)
    return null
  }
}
export async function createNewConversation(
  memberOneId: string,
  memberTwoId: string
) {
  try {
    return await prisma.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    })
  } catch (error) {
    console.log(error)
    return null
  }
}

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let conversation =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberTwoId, memberOneId))
  if (!conversation) {
    conversation = await createNewConversation(memberOneId, memberTwoId)
  }
  return conversation
}
