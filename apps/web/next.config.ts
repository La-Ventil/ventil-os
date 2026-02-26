import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: import('next').NextConfig = {
  // Allow concurrent Next dev servers for Playwright parallel processes.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  transpilePackages: ['@repo/application', '@repo/domain', '@repo/form', '@repo/ui', '@repo/view-models']
};

export default withNextIntl(nextConfig);
