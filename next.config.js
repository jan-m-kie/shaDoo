/** @type {import('next').NextConfig} */
const nextConfig = {

  // Modern Next.js 14+ configuration
  poweredByHeader: false,
  compress: true,
  // Enable SWC minification for better performance
  swcMinify: true,
  // Optimize images if needed later
  images: {
    unoptimized: true
  }

}

module.exports = nextConfig