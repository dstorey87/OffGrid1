/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/wp-json/:path*',
        destination: `${process.env.WORDPRESS_API_URL || 'http://localhost:8080/wp-json'}/:path*`,
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_WP_URL: process.env.NEXT_PUBLIC_WP_URL,
  },
};

module.exports = nextConfig;
