import createNextIntlPlugin from 'next-intl/plugin';
import { withPigment } from '@pigment-css/nextjs-plugin';
import { theme } from '@repo/ui/theme';

const withNextIntl = createNextIntlPlugin();

const nextConfig: import('next').NextConfig = {
  transpilePackages: ['@repo/ui']
};

const pigmentConfig: import('@pigment-css/nextjs-plugin').PigmentOptions = {
  transformLibraries: ['@mui/material'],
  theme
};

export default withPigment(withNextIntl(nextConfig), pigmentConfig);
