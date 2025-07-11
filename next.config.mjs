/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build configuration
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.openai.com https://api.stripe.com; frame-src https://js.stripe.com;",
          },
        ],
      },
    ];
  },

  // Image optimization
  images: {
    domains: ['localhost', 'app.codepal.com', 'api.codepal.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Experimental features
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
    optimizeCss: true,
    scrollRestoration: true,
    legacyBrowsers: false,
    browsersListForSwc: true,
  },

  // Webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Security: Remove console.log in production
    if (!dev) {
      config.optimization.minimizer.push(
        new webpack.optimize.TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
          },
        })
      );
    }

    // Bundle analyzer (optional)
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      );
    }

    return config;
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true,
      },
    ];
  },

  // Rewrites for API proxy
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: '/api/:path*',
      },
    ];
  },

  // ESLint and TypeScript (disabled for faster builds, handled in CI)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Performance optimizations
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Monitoring and analytics
  async generateBuildId() {
    return process.env.BUILD_ID || 'build-' + Date.now();
  },
};

export default nextConfig;
