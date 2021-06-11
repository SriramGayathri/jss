const jssConfig = require('./src/temp/config');
const packageConfig = require('./package.json').config;

// A public URL (and uses below) is required for Sitecore Experience Editor support.
// This is set to http://localhost:3000 by default. See .env for more details.
const publicUrl = process.env.PUBLIC_URL;

const nextConfig = {

  // Set assetPrefix to our public URL
  assetPrefix: publicUrl,

  // Allow specifying a distinct distDir when concurrently running app in a container
  distDir: process.env.NEXTJS_DIST_DIR || '.next',

  // Make the same PUBLIC_URL available as an environment variable on the client bundle
  env: {
    PUBLIC_URL: publicUrl,
  },

  i18n: {
    locales: ['en', 'da-DK'],
    defaultLocale: packageConfig.language,
  },

  /**
   * Proxy Sitecore paths
   */
  async rewrites() {
    return [
      {
        source: '/sitecore/:path*',
        destination: `${jssConfig.sitecoreApiHost}/sitecore/:path*`,
      },
      {
        source: '/:locale/sitecore/:path*',
        destination: `${jssConfig.sitecoreApiHost}/sitecore/:path*`,
      },
      // media items
      {
        source: '/-/:path*',
        destination: `${jssConfig.sitecoreApiHost}/-/:path*`,
      },
      {
        source: '/:locale/-/:path*',
        destination: `${jssConfig.sitecoreApiHost}/-/:path*`,
      },
      // visitor identification
      {
        source: '/layouts/:path*',
        destination: `${jssConfig.sitecoreApiHost}/layouts/:path*`,
      },
      {
        source: '/:locale/layouts/:path*',
        destination: `${jssConfig.sitecoreApiHost}/layouts/:path*`,
      },
    ];
  },
}

module.exports = nextConfig;
