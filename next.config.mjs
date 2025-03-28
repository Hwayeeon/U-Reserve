/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    authInterrupts: true,
  }
};

export default nextConfig;
