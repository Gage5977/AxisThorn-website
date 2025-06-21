/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://axisthorn.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  generateIndexSitemap: false,
  exclude: ['/api/*', '/success', '/preview'],
  robotsTxtOptions: {
    additionalSitemaps: [],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/preview'],
      },
    ],
  },
  transform: async (config, path) => {
    // Custom priority for important pages
    const customPriority = {
      '/': 1.0,
      '/axis-ai': 0.9,
      '/terminal': 0.8,
      '/billing': 0.8,
      '/subscribe': 0.7,
    };

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: customPriority[path] || config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};