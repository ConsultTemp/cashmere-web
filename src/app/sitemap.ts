import type { MetadataRoute } from "next"
import { studios } from "@/lib/studios"
import { services } from "@/lib/services"

// Funzione per generare la sitemap dinamica
export default function sitemap(): MetadataRoute.Sitemap {
  // URL base del sito
  const baseUrl = "https://cashmerestudio.it"

  // Data corrente per lastModified
  const currentDate = new Date()

  // Pagine statiche principali
  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contacts`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/book`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
  ]

  // Pagine dinamiche per gli studi
  const studioPages = studios.map((studio) => ({
    url: `${baseUrl}/studio/${studio.id}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  // Pagine dinamiche per i servizi
  const servicePages = services.map((service) => ({
    url: `${baseUrl}/service/${service.id}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  // Combina tutte le pagine
  return [...staticPages, ...studioPages, ...servicePages]
}
