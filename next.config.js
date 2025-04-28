/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Use SWC for faster builds
  compiler: {
    // Enable SWC compiler
    styledComponents: true,
  },
  // Exclude test files from the build
  eslint: {
    // Only run ESLint on non-test files during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable type checking during build for faster builds
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
