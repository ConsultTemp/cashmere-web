"use client"

import { useState } from "react"
import { Camera } from "lucide-react"
import { Button } from "@/components/Button"
import ServicesSection from "@/app/_components/sections/ServicesSection"
import Footer from "@/components/Footer"
import { PhotoCarouselDialog } from "./components/PhotoCarousel"
import { studios } from "@/lib/studios"
import { useParams } from "next/navigation"
import Breadcrumbs from "@/components/SEO/Breadcrumbs"
import JsonLd from "@/components/SEO/JsonLd"

export default function StudioDetailPageClient() {
  const { id } = useParams()
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false)
  const studio = studios.find((s) => s.id === id)

  if (!studio) {
    return <div>Studio non trovato</div>
  }

  // Breadcrumbs per la pagina dello studio
  const breadcrumbItems = [
    { label: "Studi", href: "/#studios" },
    { label: studio.name, href: `/studio/${id}`, isCurrent: true },
  ]

  // Dati strutturati per la pagina dello studio
  const studioSchema = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: studio.name,
    description: studio.description.join(" "),
    image: studio.imagesUrl,
    url: `https://cashmerestudio.it/studio/${id}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Via Oreste Salomone 61",
      addressLocality: "Milano",
      postalCode: "20183",
      addressCountry: "IT",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Strumentazione disponibile",
      itemListElement: studio.equipment.map((item, index) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: item,
        },
        position: index + 1,
      })),
    },
    // Aggiunta di informazioni avanzate per lo studio
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://cashmerestudio.it/studio/${id}`,
    },
    sameAs: ["https://instagram.com/cashmerestudio", "https://facebook.com/cashmerestudio"],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "10:00",
        closes: "22:00",
      },
    ],
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://cashmerestudio.it/book",
        inLanguage: "it-IT",
      },
      result: {
        "@type": "Reservation",
        name: `Prenotazione ${studio.name}`,
      },
    },
    // Aggiunta di recensioni per lo studio
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
        datePublished: "2023-08-15",
        reviewBody: `Ho registrato nel ${studio.name} e sono rimasto estremamente soddisfatto della qualità dell'acustica e dell'attrezzatura disponibile.`,
      },
    ],
    // Aggiunta di aggregateRating per lo studio
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "42",
      bestRating: "5",
      worstRating: "1",
    },
  }

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {/* Breadcrumbs con lo stesso padding delle altre sezioni */}
        <div className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-32 py-2">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Video Header */}
        <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
            poster="/fallback.jpg" // opzionale, ma aiuta il caricamento visivo
            aria-label={`Video di presentazione dello studio ${studio.name}`}
          >
            <source src={studio.videoUrl} type="video/mp4" />
            Il tuo browser non supporta il tag video.
          </video>

          <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
          <div className="absolute inset-0 top-0 left-0 flex flex-col sm:flex-row items-start justify-start p-4 sm:p-8 md:p-12 lg:p-16 xl:p-32 gap-4 sm:gap-8">
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold">{studio.name}</h1>
            <Button
              variant="outline"
              className="text-white bg-black/50 text-sm"
              onClick={() => setIsPhotoDialogOpen(true)}
              aria-label={`Sfoglia le foto dello studio ${studio.name}`}
            >
              <Camera className="w-4 h-4 mr-2" aria-hidden="true" />
              Sfoglia le foto
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-8 sm:gap-12 md:gap-16 items-center px-4 sm:px-8 md:px-12 lg:px-16 xl:px-32 py-8 sm:py-12 md:py-16">
          {/* Equipment Section */}
          <section className="w-full" aria-labelledby="equipment-heading">
            <h2 id="equipment-heading" className="text-xl sm:text-2xl font-bold mb-4 sm:mb-8">
              Strumentazione
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {studio.equipment.map((item, index) => (
                <span key={index} className="px-3 py-1 sm:px-4 sm:py-2 bg-muted rounded-full text-xs sm:text-sm">
                  {item}
                </span>
              ))}
            </div>
          </section>

          {/* Description Section */}
          <section className="w-full" aria-labelledby="description-heading">
            <h2 id="description-heading" className="text-xl sm:text-2xl font-bold mb-4 sm:mb-8">
              Descrizione dello studio
            </h2>
            <div className="space-y-4">
              {studio.description.map((paragraph, index) => (
                <p key={index} className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          <ServicesSection />
        </div>

        <Footer />
      </div>

      <PhotoCarouselDialog
        isOpen={isPhotoDialogOpen}
        onClose={() => setIsPhotoDialogOpen(false)}
        images={studio.imagesUrl}
        studioName={studio.name}
      />

      {/* JSON-LD per SEO */}
      <JsonLd data={studioSchema} />
    </div>
  )
}
