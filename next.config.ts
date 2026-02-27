import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security Headers - Protects against common vulnerabilities
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Content Security Policy - Prevents XSS and data injection attacks
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://ik.imagekit.io",
              "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com",
              "font-src 'self' data: https://fonts.gstatic.com https://ik.imagekit.io",
              "img-src 'self' blob: data: https://ik.imagekit.io https://cdn.jsdelivr.net https://images.unsplash.com",
              "connect-src 'self' https://ik.imagekit.io https://api.imagekit.io",
              "frame-src 'self' https://www.youtube.com https://player.vimeo.com",
              "media-src 'self' blob: https://ik.imagekit.io",
              "object-src 'none'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "block-all-mixed-content",
              "upgrade-insecure-requests",
            ].join("; "),
          },
          // X-Frame-Options - Prevents clickjacking attacks
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          // X-Content-Type-Options - Prevents MIME type sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Referrer-Policy - Controls referrer information sent with requests
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Permissions-Policy - Controls browser features and APIs
          {
            key: "Permissions-Policy",
            value: [
              "camera=()",
              "microphone=()",
              "geolocation=()",
              "payment=()",
              "usb=()",
              "fullscreen=()",
              "autoplay=()",
            ].join(", "),
          },
          // Strict Transport Security (HSTS) - Forces HTTPS
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
