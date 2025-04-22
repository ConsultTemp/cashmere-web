"use client"

import { Carousel, CarouselItem, CarouselNext, CarouselPrevious, CarouselContent } from "@/components/Carousel"
import PortfolioCard from "../PortfolioCard"
import type { PortfolioItem } from "@/types/types"
import mambolosco from '../../../../public/Foto artisti/Mambolosco.jpg'
import flacog from '../../../../public/Foto artisti/Flaco-G.jpg'
import moise from '../../../../public/Foto artisti/Moise Kean.jpg'
import niko from '../../../../public/Foto artisti/Niko-pandetta.jpg'
import neima from '../../../../public/Foto artisti/Neima.jpg'
import niky from '../../../../public/Foto artisti/Niky-Savage.jpg'

const portfolioItems: PortfolioItem[] = [
  {
    title: "Mambolosco",
    artist: "Mambolosco",
    imageUrl: mambolosco,
    tags: ["Rec", "Mix & Master"],
  },
  {
    title: "Niky Savage",
    artist: "Niky Savage",
    imageUrl: niky,
    tags: ["Rec"],
  },
  {
    title: "Neima Ezza",
    artist: "Neima Ezza",
    imageUrl: neima,
    tags: ["Rec", "Produzione"],
  },
  {
    title: "KMB (Moise Kean)",
    artist: "KMB (Moise Kean)",
    imageUrl: moise,
    tags: ["Rec"],
  },
  {
    title: "Niko Pandetta",
    artist: "Niko Pandetta",
    imageUrl: niko,
    tags: ["Rec", "Mix & Master"],
  },
  {
    title: "Flaco G",
    artist: "Flaco G",
    imageUrl: flacog,
    tags: ["Rec"],
  }
]

export default function PortfolioGrid() {
  return (
    <section className="relative w-full">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-3xl poppins-semibold">Hanno registrato da noi</h2>
        <a href="/portfolio" className="text-black text-sm underline-offset-4 hover:underline">
          Visualizza tutti
        </a>
      </div>

      {/* Carousel */}
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
        scrollAmount={2}

      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {portfolioItems.map((item, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <PortfolioCard {...item} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div>
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    </section>
  )
}

