/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    formats: ['image/avif', 'image/webp'],
  },

  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'rumah-honda-motor.vercel.app',
          },
        ],
        destination: 'https://www.rumahhondamotor.my.id/:path*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
