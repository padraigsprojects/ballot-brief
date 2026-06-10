import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.congress.gov",
        pathname: "/img/**",
      },
      {
        protocol: "https",
        hostname: "bioguide.congress.gov",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
