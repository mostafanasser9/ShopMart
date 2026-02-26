import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return []
  },
  reactCompiler: true,
};

export default nextConfig;
