'use client'
import { useEffect, useState } from 'react'
import {
  AudioConference,
  LiveKitRoom,
  VideoConference,
} from '@livekit/components-react'
import '@livekit/components-styles'
import { useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import { useLocale } from 'next-intl'
import axios from 'axios'

interface Props {
  chatId: string
  video: boolean
  audio: boolean
}
export function MediaRoom({ chatId, video, audio }: Props) {
  const { user } = useUser()
  const [token, setToken] = useState<string>('')
  useEffect(() => {
    if (!user?.username) return
    ;(async () => {
      try {
        const res = await axios.get(
          `/api/livekit?username=${user.username}&room=${chatId}`
        )
        const data = await res.data
        setToken(data.token)
      } catch (e) {
        console.log(e)
      }
    })()
  }, [user?.username, chatId])

  if (token === '') {
    return (
      <section className=" flex-1 flex flex-col justify-center items-center">
        <Loader2 className="size-16 text-zinc-500 dark:text-zinc-400 my-2 animate-spin" />
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          Loading media room...
        </p>
      </section>
    )
  }
  if (video) {
    return (
      <LiveKitRoom
        data-lk-theme="default"
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        token={token}
        video={video}
        audio={audio}
        connect={true}
      >
        <VideoConference />
      </LiveKitRoom>
    )
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      video={video}
      audio={audio}
      connect={true}
    >
      <AudioConference />
    </LiveKitRoom>
  )
}
