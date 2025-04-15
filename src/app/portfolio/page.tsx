import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { pageSEO, portfolioSchema } from "@/lib/seo-config"
import JsonLd from "@/components/SEO/JsonLd"
import instagram from '../../../public/instagram-grey.svg'
import spotify from '../../../public/spotify-grey.svg'
import mambolosco from '../../../public/Foto artisti/Mambolosco.jpg'
import flacog from '../../../public/Foto artisti/Flaco-G.jpg'
import moise from '../../../public/Foto artisti/Moise Kean.jpg'
import niko from '../../../public/Foto artisti/Niko-pandetta.jpg'
import neima from '../../../public/Foto artisti/Neima.jpg'
import niky from '../../../public/Foto artisti/Niky-Savage.jpg'


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

  // Breadcrumbs per la pagina portfolio
  const breadcrumbItems = [{ label: "Portfolio", href: "/portfolio", isCurrent: true }]

  return (
    <>
      <div className="bg-white">

        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h1 className="text-3xl poppins-semibold mb-16 text-center">Artisti</h1>

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
                      <Image src={instagram} alt="Whatsapp logo" className="h-5 w-5" />
                    </Link>
                    <Link
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-black"
                      aria-label={`Visita il profilo Instagram di ${item.artist}`}
                    >
                      <Image src={spotify} alt="Whatsapp logo" className="h-5 w-5" />
                    </Link>
                  </div>
                  <meta itemProp="inLanguage" content="it" />
                  <meta itemProp="recordedAt" content="Cashmere Studio Milano" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* JSON-LD per SEO */}
      <JsonLd data={portfolioSchema(portfolioItems)} />
    </>
  )
}
