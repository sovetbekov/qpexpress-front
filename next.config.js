/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    output: 'standalone',
    experimental: {
        serverActions: {
            allowedOrigins: ['qpexpress.kz', 'localhost:3000'],
        }
    }
}

module.exports = nextConfig
