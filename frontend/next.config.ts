import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const raw = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL;
    if (!raw) {
      return [];
    }

    const trimmed = raw.replace(/\/$/, "");
    const backendBase = trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;

    return [
      {
        source: "/api/:path*",
        destination: `${backendBase}/:path*`
      }
    ];
  }
};

export default nextConfig;
