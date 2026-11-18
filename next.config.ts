import path from 'node:path';
import type { NextConfig } from 'next';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname)
};

export default nextConfig;
