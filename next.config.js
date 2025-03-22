/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // Add this to prevent static optimization issues
  experimental: {
    isrFlushToDisk: false
  }
}

module.exports = nextConfig
