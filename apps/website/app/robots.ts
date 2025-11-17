import { MetadataRoute } from 'next';

// IMPORTANT: Change 'disallow: "/"' to 'allow: "/"' before going live
export default function robots(): Promise<MetadataRoute.Robots> {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: '/', // Block all crawlers during development
      },
    ],
    sitemap: 'https://techshift.vn/sitemap.xml', // Replace with your actual domain
  };
}
