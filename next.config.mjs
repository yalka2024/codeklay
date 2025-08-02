/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal configuration only
  poweredByHeader: false,
  
  // Disable problematic features
  experimental: {
    // Disable all experimental features
  },
  
  // Disable problematic optimizations
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
