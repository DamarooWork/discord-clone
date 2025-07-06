import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '5yv1nx4tqw.ufs.sh',
      },
    ],
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
}
const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)
