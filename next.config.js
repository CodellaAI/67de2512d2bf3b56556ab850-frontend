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

if (process.env.NEXT_PUBLIC_API_URL) {
  try {
    // Extract just the hostname part
    const hostname = process.env.NEXT_PUBLIC_API_URL.replace(/^https?:\/\//, '').split('/')[0];
    if (!nextConfig.images.domains.includes(hostname)) {
      nextConfig.images.domains.push(hostname);
      console.log(`Added ${hostname} to image domains`);
    }
  } catch (error) {
    console.warn(`Error adding API domain to images config: ${error.message}`);
  }
}

module.exports = nextConfig
