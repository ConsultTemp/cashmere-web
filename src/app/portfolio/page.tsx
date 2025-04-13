import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Instagram } from "lucide-react"
import { NavbarVariants } from "@/components/navbar/Navbar"
import Footer from "@/components/Footer"
import { pageSEO, portfolioSchema } from "@/lib/seo-config"
import JsonLd from "@/components/SEO/JsonLd"
import Breadcrumbs from "@/components/SEO/Breadcrumbs"

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
      title: "Lazza - Sirio",
      artist: "Lazza",
      image: "/placeholder.svg?height=400&width=600",
      year: 2022,
      description: "Album di platino con oltre 500.000 copie vendute",
      link: "https://open.spotify.com/album/5jP7LpQQzF1oKKaRMUbYsj",
      instagram: "https://instagram.com/thelazzinho",
      genre: "Rap/Hip-Hop",
      duration: "PT1H10M",
    },
    {
      id: 2,
      title: "Blanco - Blu Celeste",
      artist: "Blanco",
      image: "/placeholder.svg?height=400&width=600",
      year: 2021,
      description: "Album di debutto con il singolo 'Mi fai impazzire'",
      link: "https://open.spotify.com/album/1wdTbGg4lrQPUDbRwJDvPo",
      instagram: "https://instagram.com/blanchitobebe",
      genre: "Pop/Urban",
      duration: "PT45M30S",
    },
    {
      id: 3,
      title: "Sfera Ebbasta - Famoso",
      artist: "Sfera Ebbasta",
      image: "/placeholder.svg?height=400&width=600",
      year: 2020,
      description: "Album con collaborazioni internazionali",
      link: "https://open.spotify.com/album/09OZ9zJh7MCqO5PE9JxoaZ",
      instagram: "https://instagram.com/sferaebbasta",
      genre: "Trap",
      duration: "PT52M15S",
    },
    {
      id: 4,
      title: "Måneskin - Teatro d'ira",
      artist: "Måneskin",
      image: "/placeholder.svg?height=400&width=600",
      year: 2021,
      description: "Album che ha portato la band alla vittoria dell'Eurovision",
      link: "https://open.spotify.com/album/7KF1Ain9mYYlg5M46g0i4A",
      instagram: "https://instagram.com/maneskinofficial",
      genre: "Rock",
      duration: "PT48M20S",
    },
    {
      id: 5,
      title: "Ghali - DNA",
      artist: "Ghali",
      image: "/placeholder.svg?height=400&width=600",
      year: 2020,
      description: "Album con influenze nordafricane e sonorità innovative",
      link: "https://open.spotify.com/album/0OXyVMXQzJQMAgwXzdYHxE",
      instagram: "https://instagram.com/ghali",
      genre: "Urban/World",
      duration: "PT55M40S",
    },
    {
      id: 6,
      title: "Cosmo - La terza estate dell'amore",
      artist: "Cosmo",
      image: "/placeholder.svg?height=400&width=600",
      year: 2021,
      description: "Album elettronico con influenze dance e italodisco",
      link: "https://open.spotify.com/album/5KrPbjOxMRrRQ8YME5H9Qz",
      instagram: "https://instagram.com/cosmoofficial",
      genre: "Elettronica/Dance",
      duration: "PT1H5M",
    },
    {
      id: 7,
      title: "Madame - Madame",
      artist: "Madame",
      image: "/placeholder.svg?height=400&width=600",
      year: 2021,
      description: "Album di debutto con il singolo 'Voce'",
      link: "https://open.spotify.com/album/0ULjvpj64YCVoW8t2QHi7D",
      instagram: "https://instagram.com/sonolamadame",
      genre: "Urban/Pop",
      duration: "PT42M10S",
    },
    {
      id: 8,
      title: "Salmo - Playlist",
      artist: "Salmo",
      image: "/placeholder.svg?height=400&width=600",
      year: 2018,
      description: "Album con record di streaming in Italia",
      link: "https://open.spotify.com/album/0iaBNn7lrJxZQpGn9DkaAJ",
      instagram: "https://instagram.com/lebonwski",
      genre: "Rap/Hip-Hop",
      duration: "PT58M25S",
    },
  ]

  // Breadcrumbs per la pagina portfolio
  const breadcrumbItems = [{ label: "Portfolio", href: "/portfolio", isCurrent: true }]

  return (
    <>
      <div className="bg-white">
        {/* Breadcrumbs con lo stesso padding delle altre sezioni */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-12 text-center">Portfolio</h1>

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
                    alt={`${item.title} - Album di ${item.artist} registrato presso Cashmere Studio`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform hover:scale-105"
                    loading="lazy"
                    priority={item.id <= 4} // Carica prioritariamente solo i primi 4 elementi
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold line-clamp-1" itemProp="name">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2" itemProp="byArtist">
                    {item.artist}
                  </p>
                  <p className="text-sm line-clamp-2 mb-3" itemProp="description">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-black"
                      aria-label={`Visita il profilo Instagram di ${item.artist}`}
                    >
                      <Instagram className="h-5 w-5" />
                    </Link>
                    <Link
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium flex items-center gap-1 text-gray-700 hover:text-black"
                      itemProp="url"
                      aria-label={`Ascolta ${item.title} di ${item.artist} su Spotify`}
                    >
                      Ascolta <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                  <meta itemProp="datePublished" content={`${item.year}`} />
                  <meta itemProp="genre" content={item.genre} />
                  <meta itemProp="duration" content={item.duration} />
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
