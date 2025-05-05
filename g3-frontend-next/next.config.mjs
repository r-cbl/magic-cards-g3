/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      esmExternals: false, 
      appDir: true, 
    },
    reactStrictMode: true,
    swcMinify: true,
  };
    
export default nextConfig;
