import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { GlobalStructuredData } from "@/components/GlobalStructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://piriven.moe.gov.lk';
const DEFAULT_TITLE = 'Division of Piriven Education';
const DESCRIPTION = 'Official portal of the Division of Piriven & Bhikkhu Education sharing news, publications, events, and resources for Sri Lankan Piriven institutions.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${DEFAULT_TITLE}`,
  },
  description: DESCRIPTION,
  keywords: [
    'Piriven Education',
    'Bhikkhu Education',
    'Sri Lanka',
    'Dhamma Schools',
    'Ministry of Education',
    'Religious Studies',
  ],
  category: 'education',
  authors: [{ name: 'Division of Piriven Education' }],
  alternates: {
    canonical: SITE_URL,
    languages: {
      en: SITE_URL,
      si: `${SITE_URL}/?lang=si`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    title: DEFAULT_TITLE,
    description: DESCRIPTION,
    siteName: DEFAULT_TITLE,
    images: [
      {
        url: `${SITE_URL}/images/logo.png`,
        width: 800,
        height: 800,
        alt: DEFAULT_TITLE,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DESCRIPTION,
    images: [`${SITE_URL}/images/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  icons: { icon: '/favicon.ico' },
  other: {
    'theme-color': '#8b0000',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        data-gramm="false"
        data-gramm_editor="false"
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <GlobalStructuredData />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
