/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["images.unsplash.com", "static.ghost.org", "www.gravatar.com", "localhost", "ghost-test-2.ghost.io"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/ads.txt',
        destination: '/public/ads.txt',
      },
    ];
  },
};

export default nextConfig;
