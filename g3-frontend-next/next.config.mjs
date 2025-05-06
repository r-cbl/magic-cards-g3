/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      esmExternals: false, 
      appDir: true, 
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      domains: ['placeholder.com'],
      unoptimized: true,
    },
    output: 'standalone',
    reactStrictMode: true,
    swcMinify: true,
  };
    
export default nextConfig;
