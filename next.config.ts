import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'opulent-mammoth-294.convex.cloud',
        port: '',
        pathname: '/my-bucket/**',
        search: '',
      },
    ],
  },
  
}

export default nextConfig;
