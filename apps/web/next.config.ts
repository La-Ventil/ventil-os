import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: import('next').NextConfig = {
  transpilePackages: ['@repo/application', '@repo/domain', '@repo/form', '@repo/ui', '@repo/view-models']
};

export default withNextIntl(nextConfig);
