/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    // Enable partial pre-rendering for mixed static/dynamic pages
    ppr: false,
  },
};

module.exports = nextConfig;
