
import { Server as NetServer } from 'http'
import { Server as ServerIO } from 'socket.io'
import { NextApiRequest } from 'next'
import { NextApiResponseServerIo } from '@/shared/types'

export const config = {
  api: {
    bodyParser: false,
  },
}

const ioHandler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const httpServer: NetServer = res.socket.server as any
    const io = new ServerIO(httpServer, {
      path: `/api/socket/io`,
      addTrailingSlash: false,
    })
    res.socket.server.io = io
  }
  res.end()
}

export default ioHandler
