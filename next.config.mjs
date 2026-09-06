/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  // Headers de segurança serão aplicados via _headers no deploy estático
  // (não use headers() com output: 'export')
};

export default nextConfig;