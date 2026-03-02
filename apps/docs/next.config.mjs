const isStaticExport = process.env.DOCS_EXPORT === '1';
const inferredBasePath =
  process.env.GITHUB_ACTIONS === 'true' && process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}`
    : '';
const basePath = process.env.DOCS_BASE_PATH ?? inferredBasePath;

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(isStaticExport
    ? {
        output: 'export',
        trailingSlash: true
      }
    : {}),
  ...(basePath
    ? {
        basePath
      }
    : {})
};

export default nextConfig;
