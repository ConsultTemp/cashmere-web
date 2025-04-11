import type { Metadata } from "next"
import { studios } from "@/lib/studios"
import { generateStudioTitle, generateStudioDescription } from "@/lib/seo-config"
import StudioDetailPageClient from "./StudioDetailPageClient"

// Generazione dei metadati dinamici per le pagine degli studi
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const studio = studios.find((s) => s.id === params.id)

  if (!studio) {
    return {
      title: "Studio non trovato | Cashmere Studio Milano",
      description: "Lo studio richiesto non è stato trovato.",
    }
  }

  return {
    title: generateStudioTitle(studio.name),
    description: generateStudioDescription(studio.name),
    alternates: {
      canonical: `https://cashmerestudiomilano.it/studio/${params.id}`,
    },
    openGraph: {
      title: generateStudioTitle(studio.name),
      description: generateStudioDescription(studio.name),
      url: `https://cashmerestudiomilano.it/studio/${params.id}`,
      type: "website",
      images: [
        {
          url: studio.imagesUrl[0] || "/og-studio.jpg",
          width: 1200,
          height: 630,
          alt: `${studio.name} - Cashmere Studio Milano`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: generateStudioTitle(studio.name),
      description: generateStudioDescription(studio.name),
      images: [studio.imagesUrl[0] || "/twitter-studio.jpg"],
    },
  }
}

export default function StudioDetailPage() {
  return <StudioDetailPageClient />
}
