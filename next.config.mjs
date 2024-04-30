/** @type {import('next').NextConfig} */
const nextConfig = {
    // Ignore TypeScript errors
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignore ESLint errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  // ... other configurations
};

export default nextConfig;
