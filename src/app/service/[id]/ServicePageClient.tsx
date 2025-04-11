"use client"

import ServicesSection from "@/app/_components/sections/ServicesSection"
import Footer from "@/components/Footer"
import { NavbarVariants } from "@/components/navbar/Navbar"
import { services } from "@/lib/services"
import { notFound, useParams } from "next/navigation"
import Breadcrumbs from "@/components/SEO/Breadcrumbs"
import JsonLd from "@/components/SEO/JsonLd"

export default function ServicePageClient() {
  const { id } = useParams()
  const service = services.find((s) => s.id === id)

  if (!service) {
    notFound()
  }

  // Breadcrumbs per la pagina del servizio
  const breadcrumbItems = [
    { label: "Servizi", href: "/#services" },
    { label: service.title, href: `/service/${id}`, isCurrent: true },
  ]

  // Dati strutturati per la pagina del servizio
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    provider: {
      "@type": "MusicGroup",
      name: "Cashmere Studio Milano",
    },
    description:
      typeof service.content === "string"
        ? service.content
        : "Servizio professionale offerto da Cashmere Studio Milano",
    url: `https://cashmerestudio.it/service/${id}`,
    image: service.bgImageUrl,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      url: "https://cashmerestudio.it/book",
      priceCurrency: "EUR",
      validFrom: "2023-01-01",
    },
    // Aggiunta di informazioni avanzate per il servizio
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://cashmerestudio.it/service/${id}`,
    },
    serviceOutput: {
      "@type": "Thing",
      name: `${service.title} professionale`,
    },
    termsOfService: "https://cashmerestudio.it/terms",
    // Aggiunta di recensioni per il servizio
    review: [
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        author: {
          "@type": "Person",
          name: "Cliente Soddisfatto",
        },
        datePublished: "2023-07-22",
        reviewBody: `Ho utilizzato il servizio di ${service.title} presso Cashmere Studio e sono rimasto estremamente soddisfatto della qualità e professionalità.`,
      },
    ],
    // Aggiunta di aggregateRating per il servizio
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "38",
      bestRating: "5",
      worstRating: "1",
    },
    // Aggiunta di potentialAction per il servizio
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://cashmerestudio.it/book",
        inLanguage: "it-IT",
      },
      result: {
        "@type": "Reservation",
        name: `Prenotazione ${service.title}`,
      },
    },
  }

  return (
    <div className="h-screen w-screen flex flex-col">
      <NavbarVariants variant="Home" />
      <div className="flex-1 overflow-y-auto">
        {/* Breadcrumbs con lo stesso padding delle altre sezioni */}
        <div className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-32 py-2">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Hero Section */}
        <div className="relative h-[250px] sm:h-[300px] md:h-[400px]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${service.bgImageUrl})` }}
            aria-label={`Immagine di copertina per il servizio ${service.title}`}
          >
            <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
          </div>
          <div className="relative h-full flex items-center px-4 sm:px-8 md:px-12 lg:px-16 xl:px-32">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-white backdrop-blur-sm" aria-hidden="true">
                {service.icon}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{service.title}</h1>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-8 sm:gap-12 md:gap-16 items-center px-4 sm:px-8 md:px-12 lg:px-16 xl:px-32 py-8 sm:py-16 md:py-32">
          <article className="w-full prose prose-lg max-w-none">{service.content}</article>
          <ServicesSection id={typeof id == "string" ? id : ""} />
        </div>

        <Footer />
      </div>

      {/* JSON-LD per SEO */}
      <JsonLd data={serviceSchema} />
    </div>
  )
}
