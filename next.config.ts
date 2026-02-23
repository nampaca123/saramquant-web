import type { NextConfig } from "next";

const gatewayUrl = process.env.GATEWAY_INTERNAL_URL ?? 'http://localhost:8080';

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${gatewayUrl}/api/:path*` },
      { source: '/oauth2/:path*', destination: `${gatewayUrl}/oauth2/:path*` },
      { source: '/login/oauth2/:path*', destination: `${gatewayUrl}/login/oauth2/:path*` },
    ];
  },
};

export default nextConfig;
