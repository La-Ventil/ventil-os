import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: import('next').NextConfig = {
  // Allow concurrent Next dev servers for Playwright parallel processes.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: 'standalone',
  // The avatar routes read editor images at runtime through a path file tracing cannot follow.
  outputFileTracingIncludes: {
    '/avatar-*': ['../../packages/avatar-system/src/images/editor/**']
  },
  transpilePackages: ['@repo/application', '@repo/domain', '@repo/form', '@repo/ui']
};

export default withNextIntl(nextConfig);
