import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/upload',
          '/settings',
          '/edit-profile',
          '/phone-login',
          '/forgot-password',
        ],
      },
    ],
    sitemap: 'https://ezycv.org/sitemap.xml',
  };
}
