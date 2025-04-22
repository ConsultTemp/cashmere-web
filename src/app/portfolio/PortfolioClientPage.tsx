"use client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { portfolioSchema } from "@/lib/seo-config"
import JsonLd from "@/components/SEO/JsonLd"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs"
import instagram from "../../../public/instagram-grey.svg"
import spotify from "../../../public/spotify-grey.svg"
import mambolosco from "../../../public/Foto artisti/Mambolosco.jpg"
import flacog from "../../../public/Foto artisti/Flaco-G.jpg"
import moise from "../../../public/Foto artisti/Moise Kean.jpg"
import niko from "../../../public/Foto artisti/Niko-pandetta.jpg"
import neima from "../../../public/Foto artisti/Neima.jpg"
import niky from "../../../public/Foto artisti/Niky-Savage.jpg"
import { Award, CheckCircle, Music, Shield } from "lucide-react"

export default function PortfolioClientPage() {
  const [activeTab, setActiveTab] = useState("artisti")

  const portfolioItems = [
    {
      id: 1,
      artist: "Mambolosco",
      image: mambolosco,
      link: "https://open.spotify.com/intl-it/artist/4BFn4jmfqSNaHtPWHTcy41?si=o-sDGbvkST2LbVa1W_AaqA",
      instagram: "https://www.instagram.com/mambolosco_sugo/",
    },
    {
      id: 2,
      artist: "Niky Savage",
      image: niky,
      link: "https://open.spotify.com/intl-it/artist/4w9mPW732RnZkoqsy3lRsg?si=Se3Tdy2AS1KaB5PaLHcrUA",
      instagram: "https://www.instagram.com/nikysavage/",
    },
    {
      id: 3,
      artist: "KMB (Moise Kean)",
      image: moise,
      link: "https://open.spotify.com/intl-it/artist/5uvPG968kxvq3M0ZyxZglc?si=W9veCz2XRMqgdwy7_NrTwQ",
      instagram: "https://www.instagram.com/moise_kean/",
    },
    {
      id: 4,
      artist: "Neima Ezza",
      image: neima,
      link: "https://open.spotify.com/intl-it/artist/754BUADwzMYecBgOoBaetK?si=-NzNECs4T3CLVAwnLcZrmQ",
      instagram: "https://www.instagram.com/neima_ezza/",
    },
    {
      id: 5,
      artist: "Niko Pandetta",
      image: niko,
      link: "https://open.spotify.com/intl-it/artist/5H5RWXYleho8amdspskcUb?si=8Icq-0uTQqWbnshGBVkmQw",
      instagram: "https://www.instagram.com/nikopandetta/",
    },
    {
      id: 6,
      artist: "Flaco G",
      image: flacog,
      link: "https://open.spotify.com/intl-it/artist/7uQjkmip3qpclXt7hJ6EI9?si=NLjB9jQJQLuEty7ewf8-Zg",
      instagram: "https://www.instagram.com/flacogoldfella/",
    },
  ]

  const certifications = [
    {
      id: 1,
      title: "Certificazione Acustica Professionale",
      issuer: "Acoustical Society of Italy",
      year: "2023",
      description:
        "Certificazione di eccellenza per l'acustica dello studio, conforme agli standard internazionali per la registrazione professionale.",
      icon: <Music className="h-10 w-10 text-black" />,
    },
    {
      id: 2,
      title: "Pro Tools Certified Studio",
      issuer: "Avid Technology",
      year: "2022",
      description:
        "Studio certificato per l'utilizzo professionale di Pro Tools HD con hardware e software all'avanguardia.",
      icon: <CheckCircle className="h-10 w-10 text-black" />,
    },
    {
      id: 3,
      title: "Certificazione SSL Console",
      issuer: "Solid State Logic",
      year: "2021",
      description:
        "Certificazione ufficiale per l'utilizzo e la manutenzione delle console SSL, garantendo la massima qualità del suono.",
      icon: <Shield className="h-10 w-10 text-black" />,
    },
    {
      id: 4,
      title: "Premio Miglior Studio Emergente",
      issuer: "Milano Music Awards",
      year: "2022",
      description:
        "Riconoscimento per l'eccellenza tecnica e creativa tra gli studi di registrazione emergenti nell'area di Milano.",
      icon: <Award className="h-10 w-10 text-black" />,
    },
    {
      id: 5,
      title: "Certificazione Dolby Atmos",
      issuer: "Dolby Laboratories",
      year: "2023",
      description:
        "Studio certificato per la produzione e il mixaggio in formato Dolby Atmos, offrendo un'esperienza audio immersiva e tridimensionale.",
      icon: <Music className="h-10 w-10 text-black" />,
    },
    {
      id: 6,
      title: "Certificazione Tecnici Audio",
      issuer: "Audio Engineering Society",
      year: "2022",
      description:
        "I nostri tecnici sono certificati AES, garantendo competenze professionali di alto livello in tutte le fasi della produzione audio.",
      icon: <CheckCircle className="h-10 w-10 text-black" />,
    },
  ]

  // Breadcrumbs per la pagina portfolio
  const breadcrumbItems = [{ label: "Portfolio", href: "/portfolio", isCurrent: true }]

  return (
    <>
      <div className="bg-white">
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h1 className="text-3xl poppins-semibold mb-8 text-center">Portfolio</h1>

          <Tabs defaultValue="artisti" className="w-full mb-10">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="artisti" onClick={() => setActiveTab("artisti")}>
                Artisti
              </TabsTrigger>
              <TabsTrigger value="certificazioni" onClick={() => setActiveTab("certificazioni")}>
                Certificazioni
              </TabsTrigger>
            </TabsList>

            <TabsContent value="artisti">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {portfolioItems.map((item) => (
                  <div
                    key={item.id}
                    className="overflow-hidden border border-gray-200 rounded-lg transition-all hover:shadow-md"
                    itemScope
                    itemType="https://schema.org/MusicRecording"
                  >
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={`${item.artist}`}
                        fill
                        className="object-cover aspect-square transition-transform hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-black mb-2 text-xl" itemProp="byArtist">
                        {item.artist}
                      </p>
                      <div className="flex flex-row items-center justify-start gap-2">
                        <Link
                          href={item.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-black"
                          aria-label={`Visita il profilo Instagram di ${item.artist}`}
                        >
                          <Image src={instagram || "/placeholder.svg"} alt="Instagram logo" className="h-5 w-5" />
                        </Link>
                        <Link
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-black"
                          aria-label={`Visita il profilo Spotify di ${item.artist}`}
                        >
                          <Image src={spotify || "/placeholder.svg"} alt="Spotify logo" className="h-5 w-5" />
                        </Link>
                      </div>
                      <meta itemProp="inLanguage" content="it" />
                      <meta itemProp="recordedAt" content="Cashmere Studio Milano" />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="certificazioni">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="border border-gray-200 rounded-lg p-6 transition-all hover:shadow-md"
                    itemScope
                    itemType="https://schema.org/Certification"
                  >
                    <div className="flex items-center mb-4">
                      {cert.icon}
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold" itemProp="name">
                          {cert.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          <span itemProp="issuedBy">{cert.issuer}</span> •{" "}
                          <span itemProp="dateIssued">{cert.year}</span>
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600" itemProp="description">
                      {cert.description}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </div>

      {/* JSON-LD per SEO */}
      <JsonLd data={portfolioSchema(portfolioItems)} />
    </>
  )
}
