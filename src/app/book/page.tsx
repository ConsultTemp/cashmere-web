"use client"

import Link from "next/link"
import { Button } from "@/components/Button"
import { Label } from "@/components/Label"
import ServiceCard from "./components/ServiceCard"
import { useBookingStore } from "../../store/booking-store"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Head from "next/head"
import { pageSEO } from "@/lib/seo-config"
import JsonLd from "@/components/SEO/JsonLd"

// Definizione dei tipi
export type ServiceType = "p4xv7qk2m90zylwtscbdg3nfr" | "y0m2xv7qkz4nlwt3cbdf9srpg" | "wtscbdf9xv7qkz0m2y4nlgr3p"
export type PackageType =
  | "ivljinhh3cj10wem26i7mup2kr"
  | "x8o0secmg2jie6o3jqiviaz7kx"
  | "bre5y3oupkoy1p5n6adf9w5kyr"
  | "838jf1d16rf5q25ddlxszgtxo6"

export default function BookingPage() {
  const [services, setServices] = useState<ServiceType[]>([])
  const {
    selectedServices,
    selectedPackage,
    setSelectedServices,
    setSelectedPackage,
    setNeedsEngineer,
    setSelectedEngineer,
  } = useBookingStore()
  const router = useRouter()

  // Breadcrumbs per la pagina di prenotazione
  const breadcrumbItems = [{ label: "Prenota", href: "/book", isCurrent: true }]

  // Dati strutturati per la pagina di prenotazione
  const bookingSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Prenota una Sessione | Cashmere Studio Milano",
    description:
      "Prenota una sessione di registrazione, mix, master o produzione presso Cashmere Studio Milano. Scegli tra i nostri servizi e pacchetti personalizzati.",
    mainEntity: {
      "@type": "Service",
      name: "Servizi di Registrazione Musicale",
      provider: {
        "@type": "MusicGroup",
        name: "Cashmere Studio Milano",
      },
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
      },
    },
  }

  const toggleService = (service: ServiceType) => {
    if (!service) return

    // Verifica se il servizio è già selezionato
    const isSelected = services.includes(service)

    if (service === "wtscbdf9xv7qkz0m2y4nlgr3p") {
      // Se si seleziona "Affitto Sala"
      if (isSelected) {
        // Se è già selezionato, lo rimuoviamo
        setServices(services.filter((s) => s !== service))
      } else {
        // Se non è selezionato, lo impostiamo come unico servizio
        setServices([service])
      }
    } else {
      // Per gli altri servizi
      if (isSelected) {
        // Se è già selezionato, lo rimuoviamo
        setServices(services.filter((s) => s !== service))
      } else {
        // Se non è selezionato, verifichiamo che "Affitto Sala" non sia selezionato
        if (services.includes("wtscbdf9xv7qkz0m2y4nlgr3p")) {
          // Se "Affitto Sala" è selezionato, non permettiamo di selezionare altri servizi
          return
        }
        // Altrimenti aggiungiamo il servizio
        setServices([...services, service])
      }
    }
  }

  const handlePackageSelect = (pkg: PackageType) => {
    // Permettiamo la selezione dei pacchetti anche con "Affitto Sala"
    //@ts-ignore
    setSelectedPackage(pkg)
  }

  const canProceed = services.length > 0 || selectedPackage !== null

  const handleBookingRequest = () => {
    //@ts-ignore
    setSelectedServices(services)

    // If only "Affitto Sala" is selected (wtscbdf9xv7qkz0m2y4nlgr3p), skip the engineer page
    if (services.length === 1 && services.includes("wtscbdf9xv7qkz0m2y4nlgr3p")) {
      // Set needsEngineer to false and selectedEngineer to null
      setNeedsEngineer(false)
      setSelectedEngineer(null)
    }

    router.push("/book/datetime")
  }

  // Verifica se "Affitto Sala" è selezionato
  const isRentalSelected = services.includes("wtscbdf9xv7qkz0m2y4nlgr3p")

  return (
    <>
      <Head>
        <title>{pageSEO.book.title}</title>
        <meta name="description" content={pageSEO.book.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageSEO.book.canonical} />
        <meta property="og:title" content={pageSEO.book.openGraph.title} />
        <meta property="og:description" content={pageSEO.book.openGraph.description} />
        <meta property="og:url" content={pageSEO.book.canonical} />
        <meta property="og:type" content="website" />
      </Head>

      <div className="container max-w-3xl py-6 sm:py-8 px-4 sm:px-6 pb-20 sm:pb-32">
        <div className="mt-4 sm:mt-6 space-y-6 sm:space-y-8">
          <div className="space-y-2 mb-16">
            <Link href="/" className="text-sm text-black underline">
              Torna alla home
            </Link>
            <h1 className="text-2xl sm:text-3xl poppins-semibold">Prenota una sessione</h1>
            <p className="text-gray-400 text-sm">Organizza la tua sessione in modo semplice e veloce</p>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">Di quali servizi hai bisogno?</h2>
            <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
              Seleziona uno o più servizi oppure scegli tra i pacchetti.
            </p>

            <div className="space-y-4">
              <ServiceCard
                title="Registrazione"
                description="La fase di registrazione è quella in cui l'artista viene al microfono e registra le sue parti vocali."
                selected={services.includes("p4xv7qk2m90zylwtscbdg3nfr")}
                onSelect={() => toggleService("p4xv7qk2m90zylwtscbdg3nfr")}
                imageUrl="/Microfono.svg"
                disabled={isRentalSelected}
              />

              <ServiceCard
                imageUrl="/Mix & Master.svg"
                title="Mix & Master"
                description="Il Mix & Master è il processo finale di lavorazione sul beat e sulla voce, che serve a far suonare in modo professionale una canzone."
                selected={services.includes("y0m2xv7qkz4nlwt3cbdf9srpg")}
                onSelect={() => toggleService("y0m2xv7qkz4nlwt3cbdf9srpg")}
                disabled={isRentalSelected}
              />

              <ServiceCard
                imageUrl="/affittosala.svg"
                title="Affitto Sala"
                description="Affitta la sala per le tue sessioni senza servizi aggiuntivi."
                selected={services.includes("wtscbdf9xv7qkz0m2y4nlgr3p")}
                onSelect={() => toggleService("wtscbdf9xv7qkz0m2y4nlgr3p")}
              />
            </div>
          </div>
          <div className="bg-gray-100 p-4 sm:p-6 rounded-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:items-center gap-4 mb-8">
              <div className="w-16 h-16 sm:w-1/6 aspect-square flex flex-col items-center justify-center">
                <Image
                  src={"/Pacchetti.svg"}
                  alt={"Pacchetti di servizi musicali di Cashmere Studio"}
                  width={50}
                  height={50}
                  className="object-square object-cover transition-transform duration-300 hover:scale-105 rounded-md"
                />
              </div>
              <div>
                <h3 className="font-semibold text-xl">Pacchetti</h3>
                <p className="text-sm text-gray-400">Scegli tra i nostri pacchetti di servizi musicali</p>
              </div>
            </div>
            <div className="px-4 sm:px-8 pb-4 sm:pb-8">
              <h4 className="mb-4">Seleziona pacchetto</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: "ivljinhh3cj10wem26i7mup2kr", label: "2h + Mix & Master" },
                  { id: "x8o0secmg2jie6o3jqiviaz7kx", label: "2h + Mix & Master + Beat" },
                  { id: "bre5y3oupkoy1p5n6adf9w5kyr", label: "4h + 2 Mix & Master" },
                  { id: "838jf1d16rf5q25ddlxszgtxo6", label: "Beat in session" },
                ].map((pkg) => (
                  <div key={pkg.id} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value={pkg.id}
                      id={pkg.id}
                      name="package"
                      className="custom-radio"
                      checked={selectedPackage === pkg.id}
                      onChange={() => handlePackageSelect(pkg.id as PackageType)}
                    />
                    <Label htmlFor={pkg.id}>{pkg.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col py-6 sm:py-8 items-end">
          <Button
            disabled={!canProceed}
            variant="gradient"
            className="px-8 sm:px-12 py-4 sm:py-6"
            onClick={handleBookingRequest}
          >
            Avanti
          </Button>
        </div>
      </div>

      {/* JSON-LD per SEO */}
      <JsonLd data={bookingSchema} />
    </>
  )
}
