'use client';

import Script from 'next/script';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://piriven.moe.gov.lk';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'GovernmentOrganization',
  name: 'Division of Piriven Education',
  alternateName: 'Piriven & Bhikkhu Education Division',
  url: siteUrl,
  logo: `${siteUrl}/images/logo.png`,
  sameAs: [
    'https://www.facebook.com',
    'https://www.youtube.com'
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Isurupaya',
    addressLocality: 'Battaramulla',
    addressRegion: 'Western Province',
    addressCountry: 'Sri Lanka'
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+94-11-278-5141',
      contactType: 'Customer Service',
      areaServed: 'LK',
      availableLanguage: ['English', 'Sinhala']
    }
  ]
};

export function GlobalStructuredData() {
  return (
    <Script
      id="global-structured-data"
      type="application/ld+json"
      strategy="lazyOnload"
    >
      {JSON.stringify(structuredData)}
    </Script>
  );
}
