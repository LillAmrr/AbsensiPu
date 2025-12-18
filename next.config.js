/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hapus seluruh bagian `experimental: { serverActions: ... }`
  reactStrictMode: true,
  swcMinify: true,
  // ... konfigurasi lainnya
}

module.exports = nextConfig