import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Nếu deploy lên Github Pages theo dạng username.github.io/repo-name
  // thì cần bỏ comment dòng dưới và thay 'repo-name' bằng tên repository của bạn
  // basePath: '/repo-name',
};

export default nextConfig;
