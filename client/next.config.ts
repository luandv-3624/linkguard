import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        // Khi Frontend gọi /api/...
        source: '/api/:path*',
        // Next.js sẽ ngầm chuyển tiếp đến Backend Render
        destination: 'https://vn25-fs-check-luandv-3624.onrender.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;
