import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false, // Keep this false to prevent Konva double-rendering
};

export default nextConfig;