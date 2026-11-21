import type { NextConfig } from 'next';

const apiUrl = process.env.API_URL ?? 'http://localhost:4000';

const nextConfig: NextConfig = {
  // The browser only ever talks to the web app's own origin. Requests to
  // /api/* are forwarded to the NestJS API, so session cookies stay
  // same-origin locally and when hosted (Specifications §1.3, NFR-14).
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${apiUrl}/api/:path*` }];
  },
};

export default nextConfig;
