import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { defaultSEO } from "@/lib/seo-config"
import JsonLd from "@/components/SEO/JsonLd"
import { organizationSchema } from "@/lib/seo-config"

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
  metadataBase: new URL("https://cashmerestudio.it"),
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
    },
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://cashmerestudio.it",
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
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <JsonLd data={organizationSchema} />
      </body>
    </html>
  )
}

