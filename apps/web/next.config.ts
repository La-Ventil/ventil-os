import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: import('next').NextConfig = {
  transpilePackages: ['@repo/ui']
};

export default withNextIntl(nextConfig);
