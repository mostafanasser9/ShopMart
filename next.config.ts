import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/categories",
        destination: "/categories/men",
        permanent: true,
      },
    ];
  },
  reactCompiler: true,
};

export default nextConfig;
