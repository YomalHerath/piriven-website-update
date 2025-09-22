import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.piriven.education';

const staticPaths = [
  '/',
  '/about',
  '/contact',
  '/downloads',
  '/events',
  '/gallery',
  '/hero-intro',
  '/news',
  '/notices',
  '/publications',
  '/videos',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return staticPaths.map((route) => ({
    url: `${SITE_URL}${route === '/' ? '' : route}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: route === '/' ? 1 : 0.7,
  }));
}
