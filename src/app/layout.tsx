import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { Toaster } from "@/components/Toaster"
import { defaultSEO } from "@/lib/seo-config"
import JsonLd from "@/components/SEO/JsonLd"
import { organizationSchema, websiteSchema } from "@/lib/seo-config"
import { NavbarVariants } from "@/components/navbar/Navbar"
import Footer from "@/components/Footer"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap", // Ottimizzazione per il caricamento dei font
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap", // Ottimizzazione per il caricamento dei font
})

export const metadata: Metadata = {
  metadataBase: new URL("https://cashmerestudiomilano.it"),
  title: {
    default: defaultSEO.title,
    template: "%s | Cashmere Studio Milano",
  },
  description: defaultSEO.description,
  keywords: defaultSEO.keywords,
  authors: [{ name: "Cashmere Studio" }],
  creator: "Cashmere Studio",
  publisher: "Cashmere Studio",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: "/",
    languages: {
      "it-IT": "/",
      "en-US": "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://cashmerestudiomilano.it",
    siteName: "Cashmere Studio Milano",
    title: defaultSEO.title,
    description: defaultSEO.description,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Cashmere Studio Milano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultSEO.title,
    description: defaultSEO.description,
    creator: "@cashmerestudio",
    site: "@cashmerestudio",
    images: ["/twitter-image.jpg"],
  },
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
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
  category: "music",
  applicationName: "Cashmere Studio Milano",
  referrer: "origin-when-cross-origin",
  appLinks: {
    ios: {
      url: "https://cashmerestudiomilano.it/ios-app",
      app_store_id: "app-store-id",
    },
    android: {
      package: "it.cashmerestudio.app",
      app_name: "Cashmere Studio Milano",
    },
    web: {
      url: "https://cashmerestudiomilano.it",
      should_fallback: true,
    },
  },
  archives: ["https://cashmerestudiomilano.it/archive"],
  assets: ["https://cashmerestudiomilano.it/assets"],
  bookmarks: ["https://cashmerestudiomilano.it/portfolio"],
  manifest: "/site.webmanifest",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it" dir="ltr">
      <head>
        <link rel="icon" href="/cashmere-logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />

        {/* Preconnect e preload per ottimizzazione */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS Prefetch per domini esterni */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Preload delle risorse critiche */}
        <link rel="preload" as="image" href="/cashmere-logo.svg" />
      </head>
      <body className="poppins-regular" >
        <div className="h-screen w-screen flex flex-col">
          <NavbarVariants variant="Home" />
          <div className="flex-1 overflow-y-auto">
            {children}
            <Footer/>
            </div>
            
            </div>
            <JsonLd data={organizationSchema} />
            <JsonLd data={websiteSchema} />
          </body>
        </html>
        )
}
