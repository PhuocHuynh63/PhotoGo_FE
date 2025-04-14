import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
          protocol: 'https',
          hostname: 'res.cloudinary.com', // Replace with your image host
          port: '',
          pathname: '/**',
      },
      // Add more patterns as needed
  ],
  },
};

export default nextConfig;
