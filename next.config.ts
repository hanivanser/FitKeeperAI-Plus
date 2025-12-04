/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,   // ← ESTO ES LA CLAVE
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;