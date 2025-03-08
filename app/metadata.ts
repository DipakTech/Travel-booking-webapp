import { Metadata } from "next";

const siteConfig = {
  name: "Nepal Guide Connect",
  description:
    "Connect with professional local guides for authentic Nepalese trekking experiences. Find expert guides, plan your trek, and explore the Himalayas with confidence.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://travel.oneclickresult.com",
  ogImage: "/og-image.jpg",
  links: {
    twitter: "https://twitter.com/nepalguideconnect",
    github: "https://github.com/nepalguideconnect",
  },
  keywords: [
    "Nepal Trekking",
    "Himalayan Guides",
    "Mountain Trekking",
    "Nepal Tourism",
    "Professional Guides",
    "Everest Region",
    "Annapurna Circuit",
    "Trekking Routes",
    "Adventure Tourism",
    "Nepal Travel",
  ],
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: "Nepal Guide Connect",
      url: siteConfig.url,
    },
  ],
  creator: "Nepal Guide Connect",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@nepalguideconnect",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "icon",
      url: "/favicon-32x32.png",
    },
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification",
    yandex: "your-yandex-verification",
  },
};
