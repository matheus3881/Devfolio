/** @type {import('next').NextConfig} */

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    // Prevent the site from being embedded in iframes (clickjacking)
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    // Prevent MIME-type sniffing
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    // HSTS: enforce HTTPS for 1 year, include subdomains, allow preload
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  {
    // Limit referrer info to same origin or origin-only on cross-origin
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    // Disable browser features not needed by this portfolio
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    // Content Security Policy
    // - script-src: self + Vercel Analytics CDN
    // - style-src: self + unsafe-inline required by Tailwind's inline styles
    // - font-src: self + Google Fonts CDN (Archivo, Geist served via next/font are inlined, but fallback)
    // - connect-src: self + Vercel Analytics API
    // - frame-ancestors: none (redundant with X-Frame-Options, belt-and-suspenders)
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://vitals.vercel-insights.com",
      "frame-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join('; '),
  },
]

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Security headers — applied at the CDN/server level for static export
  // For Cloudflare Pages: these are set in _headers file (generated separately)
  // For local Next.js dev server: applied via headers()
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
