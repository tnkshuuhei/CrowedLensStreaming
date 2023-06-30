/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: "",
  transpilePackages: ["@lens-protocol"],
  images: {
    domains: ["ik.imagekit.io", ""],
  },
};

module.exports = nextConfig;
