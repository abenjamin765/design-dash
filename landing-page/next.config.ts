import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/design-dash",
  assetPrefix: "/design-dash",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
