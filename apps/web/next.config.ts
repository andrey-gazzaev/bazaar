import type { NextConfig } from 'next';

const api = process.env.API_URL ?? 'http://localhost:3001';

/** Proxies the shop API so the session cookie stays on this origin. */
const nextConfig: NextConfig = {
  agentRules: true,
  cacheComponents: true,
  partialPrefetching: true,
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${api}/api/:path*` },
      { source: '/uploads/:path*', destination: `${api}/uploads/:path*` },
    ];
  },
};

export default nextConfig;
