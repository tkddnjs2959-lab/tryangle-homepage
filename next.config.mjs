/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
      {
        key: 'Content-Security-Policy-Report-Only',
        value: [
          "default-src 'self'",
          "base-uri 'self'",
          "object-src 'none'",
          "frame-ancestors 'none'",
          "form-action 'self'",
          "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net https://www.clarity.ms https://challenges.cloudflare.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' data: https://fonts.gstatic.com",
          "img-src 'self' data: blob: https://www.facebook.com https://*.clarity.ms https://www.google-analytics.com",
          "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://www.facebook.com https://connect.facebook.net https://challenges.cloudflare.com",
          "frame-src https://challenges.cloudflare.com",
          'report-uri /api/csp-report',
        ].join('; '),
      },
    ];
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
