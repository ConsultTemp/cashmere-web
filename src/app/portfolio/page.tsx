import type { Metadata } from "next"
import { pageSEO } from "@/lib/seo-config"
import PortfolioClientPage from "./PortfolioClientPage"

// Metadati statici per la pagina portfolio
export const metadata: Metadata = {
  title: pageSEO.portfolio.title,
  description: pageSEO.portfolio.description,
  alternates: {
    canonical: pageSEO.portfolio.canonical,
  },
  openGraph: {
    title: pageSEO.portfolio.openGraph.title,
    description: pageSEO.portfolio.openGraph.description,
    url: pageSEO.portfolio.canonical,
    type: "website",
    images: [
      {
        url: "/og-portfolio.jpg",
        width: 1200,
        height: 630,
        alt: "Portfolio Cashmere Studio Milano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageSEO.portfolio.openGraph.title,
    description: pageSEO.portfolio.openGraph.description,
    images: ["/twitter-portfolio.jpg"],
  },
}

export default function PortfolioPage() {
  return <PortfolioClientPage />
}
