"use client"

import { Phone, Mail, MapPin, Clock, Instagram } from "lucide-react"
import { NavbarVariants } from "@/components/navbar/Navbar"
import Footer from "@/components/Footer"
import Head from "next/head"
import { pageSEO } from "@/lib/seo-config"
import JsonLd from "@/components/SEO/JsonLd"
import Breadcrumbs from "@/components/SEO/Breadcrumbs"

export default function ContactsPage() {
  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Telefono",
      content: "+39 351 420 6294",
      link: "tel:+393514206294",
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "WhatsApp",
      content: "+39 351 420 6294",
      link: "https://wa.me/393514206294",
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      content: "cashmerestudiomilano@gmail.com",
      link: "mailto:cashmerestudiomilano@gmail.com",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Indirizzo",
      content: "Via Oreste Salomone 61, 20183 Milano (MI)",
      link: "https://maps.google.com/?q=Via+Oreste+Salomone+61+Milano",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Orari",
      content: "Lun-Dom: 10:00 - 22:00",
    },
    {
      icon: <Instagram className="h-6 w-6" />,
      title: "Instagram",
      content: "@cashmerestudio",
      link: "https://instagram.com/cashmerestudio",
    },
  ]

  // Schema.org JSON-LD per la pagina contatti
  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contatti Cashmere Studio Milano",
    description:
      "Contatta Cashmere Studio Milano. Indirizzo: Via Oreste Salomone 61, Milano. Telefono: +39 351 420 6294. Email: cashmerestudiomilano@gmail.com",
    mainEntity: {
      "@type": "MusicGroup",
      name: "Cashmere Studio Milano",
      telephone: "+39 351 420 6294",
      email: "cashmerestudiomilano@gmail.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Via Oreste Salomone 61",
        addressLocality: "Milano",
        postalCode: "20183",
        addressCountry: "IT",
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "10:00",
        closes: "22:00",
      },
    },
  }

  // Breadcrumbs per la pagina contatti
  const breadcrumbItems = [{ label: "Contatti", href: "/contacts", isCurrent: true }]

  return (
    <>
      <Head>
        <title>{pageSEO.contacts.title}</title>
        <meta name="description" content={pageSEO.contacts.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageSEO.contacts.canonical} />
        <meta property="og:title" content={pageSEO.contacts.openGraph.title} />
        <meta property="og:description" content={pageSEO.contacts.openGraph.description} />
        <meta property="og:url" content={pageSEO.contacts.canonical} />
        <meta property="og:type" content="website" />
      </Head>

      <NavbarVariants variant="Home" />
      <div className="bg-white">
        {/* Breadcrumbs con lo stesso padding delle altre sezioni */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-12 text-center">Contatti</h1>

          <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-2 lg:gap-12">
            {/* Colonna sinistra con i contatti */}
            <div className="space-y-8 lg:pr-8">
              {contactInfo.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center group">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mr-6 group-hover:bg-gray-200 transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    {item.link ? (
                      <a
                        href={item.link}
                        target={item.link.startsWith("http") ? "_blank" : undefined}
                        rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-gray-600 hover:text-black text-lg transition-colors"
                      >
                        {item.content}
                      </a>
                    ) : (
                      <p className="text-gray-600 text-lg">{item.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Colonna destra con i contatti */}
            <div className="space-y-8 mt-8 lg:mt-0 lg:pl-8 lg:border-l lg:border-gray-200">
              {contactInfo.slice(3).map((item, index) => (
                <div key={index} className="flex items-center group">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mr-6 group-hover:bg-gray-200 transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    {item.link ? (
                      <a
                        href={item.link}
                        target={item.link.startsWith("http") ? "_blank" : undefined}
                        rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-gray-600 hover:text-black text-lg transition-colors"
                      >
                        {item.content}
                      </a>
                    ) : (
                      <p className="text-gray-600 text-lg">{item.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Dove Trovarci</h2>
          <div className="rounded-lg overflow-hidden shadow-md h-[400px] lg:h-[500px] relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2799.9821302969377!2d9.2326!3d45.4554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4786c6a6e1b835a3%3A0x2d8f95f69e4692e9!2sVia%20Oreste%20Salomone%2C%2061%2C%2020138%20Milano%20MI!5e0!3m2!1sit!2sit!4v1617289345678!5m2!1sit!2sit"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mappa di Cashmere Studio in Via Oreste Salomone 61, Milano"
            ></iframe>
          </div>
        </section>
      </div>
      <Footer />

      {/* JSON-LD per SEO */}
      <JsonLd data={contactPageSchema} />
    </>
  )
}

