"use client"

import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Instagram } from "lucide-react"
import { NavbarVariants } from "@/components/navbar/Navbar"
import Footer from "@/components/Footer"
import Head from "next/head"
import { pageSEO, portfolioSchema } from "@/lib/seo-config"
import JsonLd from "@/components/SEO/JsonLd"
import Breadcrumbs from "@/components/SEO/Breadcrumbs"

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
    },
  ]

  // Breadcrumbs per la pagina portfolio
  const breadcrumbItems = [{ label: "Portfolio", href: "/portfolio", isCurrent: true }]

  return (
    <>
      <Head>
        <title>{pageSEO.portfolio.title}</title>
        <meta name="description" content={pageSEO.portfolio.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageSEO.portfolio.canonical} />
        <meta property="og:title" content={pageSEO.portfolio.openGraph.title} />
        <meta property="og:description" content={pageSEO.portfolio.openGraph.description} />
        <meta property="og:url" content={pageSEO.portfolio.canonical} />
        <meta property="og:type" content="website" />
      </Head>

      <NavbarVariants variant="Home" />
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
                    className="object-cover transition-transform hover:scale-105"
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
                    >
                      <Instagram className="h-5 w-5" />
                    </Link>
                    <Link
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium flex items-center gap-1 text-gray-700 hover:text-black"
                      itemProp="url"
                    >
                      Ascolta <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                  <meta itemProp="datePublished" content={`${item.year}`} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />

      {/* JSON-LD per SEO */}
      <JsonLd data={portfolioSchema(portfolioItems)} />
    </>
  )
}

