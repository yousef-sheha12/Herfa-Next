/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://ammar.runasp.net/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
