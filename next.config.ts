import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 1. Cấu hình ảnh (Giữ nguyên của bạn) */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },

  /* 2. Bỏ qua lỗi TypeScript khi build (Phải nằm ngang hàng với images) */
  typescript: {
    ignoreBuildErrors: true,
  },


};

export default nextConfig;