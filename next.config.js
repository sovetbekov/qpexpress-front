/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  images: {
    domains: ["cbu01.alicdn.com"],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["qpexpress.kz", "localhost:3000"],
    },
  },
};

module.exports = nextConfig;
