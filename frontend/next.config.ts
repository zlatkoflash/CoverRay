import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false, // Keep this false to prevent Konva double-rendering

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nwmttjhoidsujwtxhedu.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'yourcover.blob.core.windows.net',
        port: '',
        pathname: '/magazinefiles/**',
      },
    ],
  },

};

export default nextConfig;