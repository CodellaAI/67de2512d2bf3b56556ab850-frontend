/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', process.env.NEXT_PUBLIC_API_URL],
  },
  // Add this to prevent static optimization issues
  experimental: {
    isrFlushToDisk: false
  }
}

module.exports = nextConfig
