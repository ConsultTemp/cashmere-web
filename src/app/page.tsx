import type { Metadata } from "next"
import { NavbarVariants } from "@/components/navbar/Navbar"
import Header from "./_components/Header"
import { StudiosSection } from "./_components/sections/StudiosSection"
import { Paragraph } from "./_components/sections/Paragraph"
import ServicesSection from "./_components/sections/ServicesSection"
import PortfolioGrid from "./_components/sections/PortfolioSection"
import Footer from "@/components/Footer"
import MapsSection from "./_components/sections/MapsSection"

export const metadata: Metadata = {
  title: "Cashmere Studio Milano - Studio di Registrazione Professionale",
  description:
    "Cashmere Studio offre servizi professionali di registrazione, mixing e mastering a Milano. Prenota ora il tuo session con i nostri ingegneri del suono esperti.",
  openGraph: {
    title: "Cashmere Studio Milano - Studio di Registrazione Professionale",
    description: "Servizi professionali di registrazione, mixing e mastering a Milano",
    url: "https://cashmerestudiomilano.it",
    siteName: "Cashmere Studio Milano",
    images: [
      {
        url: "/images/studio-og.jpg",
        width: 1200,
        height: 630,
        alt: "Cashmere Studio Milano",
      },
    ],
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cashmere Studio Milano",
    description: "Studio di registrazione professionale a Milano",
    images: ["/images/studio-og.jpg"],
  },
  alternates: {
    canonical: "https://cashmerestudiomilano.it",
  },
}

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col">
      <NavbarVariants variant="Home" />
      <div className="flex-1 overflow-y-auto">
        <Header />
        <h1 className="text-white">Cashmere Studio Milano - Studio di registrazione</h1>
        <div className="flex flex-col gap-16 sm:gap-24 md:gap-32 items-center px-4 sm:px-8 md:px-12 lg:px-16 xl:px-32 py-16 sm:py-24 md:py-32">
          <StudiosSection />
          <Paragraph />
          <ServicesSection />
          <MapsSection />
          <PortfolioGrid />
        </div>
        <Footer />
      </div>

      {/* JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MusicGroup",
            name: "Cashmere Studio Milano",
            description: "Studio di registrazione professionale a Milano",
            url: "https://cashmerestudiomilano.it",
            logo: "https://cashmerestudiomilano.it/images/logo.png",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Milano",
              addressRegion: "MI",
              addressCountry: "IT",
            },
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+39-XXX-XXXXXXX",
              contactType: "customer service",
            },
            sameAs: ["https://www.facebook.com/cashmerestudio", "https://www.instagram.com/cashmerestudio"],
          }),
        }}
      />
    </div>
  )
}

