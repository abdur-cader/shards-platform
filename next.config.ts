import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['wjlwqhmtlzsiyhzwtety.supabase.co'],
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
