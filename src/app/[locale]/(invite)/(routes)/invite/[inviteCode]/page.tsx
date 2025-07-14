import { InviteCodePage } from "@/views"

interface Props {
  params: {
    inviteCode: string
  }
}
export  default async function InviteCode({ params }: Props) {
  const { inviteCode } = await params
  return <InviteCodePage inviteCode={inviteCode} />
}
