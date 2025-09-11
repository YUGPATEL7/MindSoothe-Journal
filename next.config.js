/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed `output: 'export'` so the app can run with dynamic server/runtime features
  // (API routes, request.json(), and force-dynamic). If you need a static export,
  // consider moving APIs to an external server or removing dynamic features.
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  trailingSlash: true,
};

module.exports = nextConfig;