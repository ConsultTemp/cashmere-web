// Configurazione SEO centralizzata
export const defaultSEO = {
    title: "Cashmere Studio Milano | Studio di Registrazione Professionale",
    description:
      "Cashmere Studio è uno studio di registrazione professionale a Milano. Offriamo servizi di registrazione, mix, master e produzione musicale di alta qualità.",
    keywords: "studio registrazione milano, registrazione musicale, mix, master, produzione musicale, cashmere studio",
    openGraph: {
      type: "website",
      locale: "it_IT",
      url: "https://cashmerestudiomilano.it",
      siteName: "Cashmere Studio Milano",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Cashmere Studio Milano",
        },
      ],
    },
    twitter: {
      handle: "@cashmerestudio",
      site: "@cashmerestudio",
      cardType: "summary_large_image",
    },
    additionalMetaTags: [
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        name: "theme-color",
        content: "#000000",
      },
    ],
    additionalLinkTags: [
      {
        rel: "icon",
        href: "/cashmere-logo.svg",
        type: "image/svg+xml",
      },
      {
        rel: "apple-touch-icon",
        href: "/apple-touch-icon.png",
        sizes: "180x180",
      },
    ],
  }
  
  // Configurazione per le pagine specifiche
  export const pageSEO = {
    home: {
      title: "Cashmere Studio Milano | Studio di Registrazione Professionale",
      description:
        "Cashmere Studio è uno studio di registrazione professionale a Milano. Offriamo servizi di registrazione, mix, master e produzione musicale di alta qualità.",
      canonical: "https://cashmerestudiomilano.it",
      openGraph: {
        title: "Cashmere Studio Milano | Studio di Registrazione Professionale",
        description:
          "Cashmere Studio è uno studio di registrazione professionale a Milano. Offriamo servizi di registrazione, mix, master e produzione musicale di alta qualità.",
      },
    },
    portfolio: {
      title: "Portfolio | Cashmere Studio Milano",
      description:
        "Scopri i progetti musicali realizzati presso Cashmere Studio Milano. Artisti di successo che hanno scelto il nostro studio di registrazione professionale.",
      canonical: "https://cashmerestudiomilano.it/portfolio",
      openGraph: {
        title: "Portfolio | Cashmere Studio Milano",
        description:
          "Scopri i progetti musicali realizzati presso Cashmere Studio Milano. Artisti di successo che hanno scelto il nostro studio di registrazione professionale.",
      },
    },
    contacts: {
      title: "Contatti | Cashmere Studio Milano",
      description:
        "Contatta Cashmere Studio Milano. Indirizzo: Via Oreste Salomone 61, Milano. Telefono: +39 351 420 6294. Email: cashmerestudiomilano@gmail.com",
      canonical: "https://cashmerestudiomilano.it/contacts",
      openGraph: {
        title: "Contatti | Cashmere Studio Milano",
        description:
          "Contatta Cashmere Studio Milano. Indirizzo: Via Oreste Salomone 61, Milano. Telefono: +39 351 420 6294. Email: cashmerestudiomilano@gmail.com",
      },
    },
    book: {
      title: "Prenota una Sessione | Cashmere Studio Milano",
      description:
        "Prenota una sessione di registrazione, mix, master o produzione presso Cashmere Studio Milano. Scegli tra i nostri servizi e pacchetti personalizzati.",
      canonical: "https://cashmerestudiomilano.it/book",
      openGraph: {
        title: "Prenota una Sessione | Cashmere Studio Milano",
        description:
          "Prenota una sessione di registrazione, mix, master o produzione presso Cashmere Studio Milano. Scegli tra i nostri servizi e pacchetti personalizzati.",
      },
    },
    studio: {
      title: "I Nostri Studi | Cashmere Studio Milano",
      description:
        "Scopri gli studi di registrazione di Cashmere Studio Milano. Attrezzature professionali, acustica ottimizzata e ambiente confortevole per le tue sessioni.",
      canonical: "https://cashmerestudiomilano.it/studio",
      openGraph: {
        title: "I Nostri Studi | Cashmere Studio Milano",
        description:
          "Scopri gli studi di registrazione di Cashmere Studio Milano. Attrezzature professionali, acustica ottimizzata e ambiente confortevole per le tue sessioni.",
      },
    },
    service: {
      title: "Servizi Musicali | Cashmere Studio Milano",
      description:
        "Servizi professionali di registrazione, mix, master e produzione musicale presso Cashmere Studio Milano. Qualità e professionalità per il tuo progetto musicale.",
      canonical: "https://cashmerestudiomilano.it/service",
      openGraph: {
        title: "Servizi Musicali | Cashmere Studio Milano",
        description:
          "Servizi professionali di registrazione, mix, master e produzione musicale presso Cashmere Studio Milano. Qualità e professionalità per il tuo progetto musicale.",
      },
    },
  }
  
  // Funzione per generare il titolo dinamico per le pagine di studio specifiche
  export const generateStudioTitle = (studioName: string) => {
    return `${studioName} | Cashmere Studio Milano`
  }
  
  // Funzione per generare la descrizione dinamica per le pagine di studio specifiche
  export const generateStudioDescription = (studioName: string) => {
    return `Scopri ${studioName} presso Cashmere Studio Milano. Attrezzature professionali, acustica ottimizzata e ambiente confortevole per le tue sessioni di registrazione.`
  }
  
  // Funzione per generare il titolo dinamico per le pagine di servizio specifiche
  export const generateServiceTitle = (serviceName: string) => {
    return `${serviceName} | Cashmere Studio Milano`
  }
  
  // Funzione per generare la descrizione dinamica per le pagine di servizio specifiche
  export const generateServiceDescription = (serviceName: string) => {
    return `Servizio professionale di ${serviceName} presso Cashmere Studio Milano. Qualità e professionalità per il tuo progetto musicale.`
  }
  
  // Schema.org JSON-LD per l'organizzazione
  export const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: "Cashmere Studio Milano",
    url: "https://cashmerestudiomilano.it",
    logo: "https://cashmerestudiomilano.it/cashmere-logo.svg",
    sameAs: [
      "https://instagram.com/cashmerestudio",
      "https://facebook.com/cashmerestudio",
      "https://twitter.com/cashmerestudio",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Via Oreste Salomone 61",
      addressLocality: "Milano",
      postalCode: "20183",
      addressCountry: "IT",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "45.4554",
      longitude: "9.2326",
    },
    telephone: "+393514206294",
    email: "cashmerestudiomilano@gmail.com",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "10:00",
        closes: "22:00",
      },
    ],
  }
  
  // Schema.org JSON-LD per i servizi
  export const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "Service",
          name: "Registrazione",
          description:
            "La fase di registrazione è quella in cui l'artista viene al microfono e registra le sue parti vocali.",
          provider: {
            "@type": "MusicGroup",
            name: "Cashmere Studio Milano",
          },
          url: "https://cashmerestudiomilano.it/service/1",
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "Service",
          name: "Mix & Master",
          description:
            "Processo finale di lavorazione sulla traccia, in breve è l'attività che serve per far suonare bene una canzone.",
          provider: {
            "@type": "MusicGroup",
            name: "Cashmere Studio Milano",
          },
          url: "https://cashmerestudiomilano.it/service/2",
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "Service",
          name: "Produzione",
          description:
            "Il nostro servizio di produzione musicale offre beat personalizzati di alta qualità su misura per l'artista.",
          provider: {
            "@type": "MusicGroup",
            name: "Cashmere Studio Milano",
          },
          url: "https://cashmerestudiomilano.it/service/3",
        },
      },
      {
        "@type": "ListItem",
        position: 4,
        item: {
          "@type": "Service",
          name: "Affitto sala",
          description:
            "Cashmere Studio è il tuo punto di riferimento per la registrazione e la produzione musicale a Milano.",
          provider: {
            "@type": "MusicGroup",
            name: "Cashmere Studio Milano",
          },
          url: "https://cashmerestudiomilano.it/service/0",
        },
      },
    ],
  }
  
  // Schema.org JSON-LD per il portfolio
  export const portfolioSchema = (items: any[]) => {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "MusicRecording",
          name: item.title,
          byArtist: {
            "@type": "MusicGroup",
            name: item.artist,
          },
          recordingOf: {
            "@type": "MusicComposition",
            name: item.title,
          },
          url: item.link || `https://cashmerestudiomilano.it/portfolio/${item.id}`,
        },
      })),
    }
  }
  
  // Schema.org JSON-LD per le breadcrumbs
  export const generateBreadcrumbSchema = (items: { name: string; url: string }[]) => {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    }
  }
  
  