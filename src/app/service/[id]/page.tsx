import type { Metadata } from "next"
import { services } from "@/lib/services"
import { generateServiceTitle, generateServiceDescription } from "@/lib/seo-config"
import ServicePageClient from "./ServicePageClient"

// Generazione dei metadati dinamici per le pagine dei servizi
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const service = services.find((s) => s.id === params.id)

  if (!service) {
    return {
      title: "Servizio non trovato | Cashmere Studio Milano",
      description: "Il servizio richiesto non è stato trovato.",
    }
  }

  return {
    title: generateServiceTitle(service.title),
    description: generateServiceDescription(service.title),
    alternates: {
      canonical: `https://cashmerestudiomilano.it/service/${params.id}`,
    },
    openGraph: {
      title: generateServiceTitle(service.title),
      description: generateServiceDescription(service.title),
      url: `https://cashmerestudiomilano.it/service/${params.id}`,
      type: "website",
      images: [
        {
          url: service.bgImageUrl || "/og-service.jpg",
          width: 1200,
          height: 630,
          alt: `${service.title} - Cashmere Studio Milano`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: generateServiceTitle(service.title),
      description: generateServiceDescription(service.title),
      images: [service.bgImageUrl || "/twitter-service.jpg"],
    },
  }
}

export default function ServicePage() {
  return <ServicePageClient />
}
