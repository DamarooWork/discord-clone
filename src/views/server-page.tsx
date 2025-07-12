interface Props {
  serverId: string
}
export async function ServerPage({ serverId }: Props) {
  return <> Servers Page #{serverId}</>
}
