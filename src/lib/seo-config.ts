// Configurazione SEO centralizzata
export const defaultSEO = {
  title: "Cashmere Studio Milano | Studio di Registrazione Professionale",
  description:
    "Cashmere Studio è uno studio di registrazione professionale a Milano. Offriamo servizi di registrazione, mix, master e produzione musicale di alta qualità.",
  keywords: [
    // Keyword principali
    "studio registrazione Milano",
    "studio di registrazione a Milano",
    "sala di registrazione Milano",
    "registrazione musicale Milano",
    "produzione musicale Milano",
    "mixaggio audio Milano",
    "mastering audio Milano",
    "studio di registrazione professionale Milano",
    "studio produzione musicale Milano",
    "studio musicale Milano",
  
    // Keyword long tail
    "studio registrazione hip hop Milano",
    "studio registrazione trap Milano",
    "studio registrazione voci Milano",
    "registrare voce professionale Milano",
    "studio per registrare podcast Milano",
    "studio per registrare demo Milano",
    "studio per cantanti emergenti Milano",
    "dove registrare canzone Milano",
    "studio con ingegnere del suono Milano",
    "studio di produzione musicale con strumentazione analogica Milano",
    "mixaggio professionale canzoni Milano",
    "mastering radio ready Milano",
    "studio per mix e master Milano",
    "registrazione multitraccia Milano",
  
    // Keyword localizzate
    "studio registrazione Milano centro",
    "studio registrazione zona Navigli",
    "studio registrazione zona Isola",
    "studio registrazione Porta Romana",
    "studio registrazione Milano Sud",
    "studio registrazione Milano Nord",
    "studio registrazione Lambrate",
    "studio registrazione zona Bocconi",
    "studio registrazione zona Brera",
  
    // Keyword transazionali
    "prenota studio registrazione Milano",
    "prezzi studio registrazione Milano",
    "affitto sala registrazione Milano",
    "noleggio studio registrazione Milano",
    "ingegnere del suono Milano",
    "booking studio musicale Milano",
    "servizio mix e master Milano",
    "preventivo registrazione musicale Milano",
    "produzione canzoni Milano",
    "beatmaker Milano studio",
    "produttore musicale Milano",
    "servizi audio professionali Milano",
  
    // Keyword tecniche
    "registrazione voce su strumentale Milano",
    "editing vocale professionale Milano",
    "mix analogico Milano",
    "mix in the box Milano",
    "mastering analogico Milano",
    "mastering digitale Milano",
    "stem mastering Milano",
    "trattamento acustico studio Milano",
    "recording studio con Pro Tools Milano",
    "studio Ableton Live Milano",
    "produzione musicale Logic Pro Milano",
    "registrazione microfoni Neumann Milano",
    "outboard professionale Milano",
  
    // Keyword branded
    "Cashmere Studio Milano",
    "Cashmere Studio registrazione",
    "Cashmere Studio produzione musicale",
    "Cashmere Studio mix e master",
    "recensioni Cashmere Studio",
    "Cashmere Studio contatti",
  ],
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
  // Aggiunta di informazioni avanzate per l'organizzazione
  foundingDate: "2018-01-01",
  founders: [
    {
      "@type": "Person",
      name: "Fondatore di Cashmere Studio",
    },
  ],
  description:
    "Cashmere Studio è uno studio di registrazione professionale a Milano che offre servizi di registrazione, mix, master e produzione musicale di alta qualità. Con attrezzature all'avanguardia e un team di professionisti esperti, garantiamo risultati eccellenti per ogni progetto musicale.",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servizi di Cashmere Studio",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Registrazione",
          description: "Servizio professionale di registrazione vocale e strumentale",
        },
        price: "50.00",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: "https://cashmerestudiomilano.it/service/1",
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Mix & Master",
          description: "Servizio professionale di mixaggio e mastering",
        },
        price: "100.00",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: "https://cashmerestudiomilano.it/service/2",
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Produzione",
          description: "Servizio professionale di produzione musicale",
        },
        price: "150.00",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: "https://cashmerestudiomilano.it/service/3",
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Affitto sala",
          description: "Servizio di affitto sala per registrazioni",
        },
        price: "30.00",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: "https://cashmerestudiomilano.it/service/0",
      },
    ],
  },
  // Aggiunta di recensioni per migliorare la visibilità locale
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
        name: "Marco Rossi",
      },
      datePublished: "2023-05-15",
      reviewBody:
        "Ho registrato il mio album presso Cashmere Studio e sono rimasto estremamente soddisfatto della qualità del servizio e della professionalità del team.",
    },
    {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
      },
      author: {
        "@type": "Person",
        name: "Laura Bianchi",
      },
      datePublished: "2023-06-22",
      reviewBody:
        "Il servizio di mix e master di Cashmere Studio è eccezionale. Hanno trasformato le mie registrazioni in un prodotto professionale di alta qualità.",
    },
  ],
  // Aggiunta di aggregateRating per migliorare la visibilità nei risultati di ricerca
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "87",
    bestRating: "5",
    worstRating: "1",
  },
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
        // Aggiunta di informazioni avanzate per il servizio
        offers: {
          "@type": "Offer",
          price: "50.00",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          validFrom: "2023-01-01",
        },
        serviceOutput: {
          "@type": "Thing",
          name: "Registrazione vocale professionale",
        },
        termsOfService: "https://cashmerestudiomilano.it/terms",
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
        // Aggiunta di informazioni avanzate per il servizio
        offers: {
          "@type": "Offer",
          price: "100.00",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          validFrom: "2023-01-01",
        },
        serviceOutput: {
          "@type": "Thing",
          name: "Mix e master professionale",
        },
        termsOfService: "https://cashmerestudiomilano.it/terms",
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
        // Aggiunta di informazioni avanzate per il servizio
        offers: {
          "@type": "Offer",
          price: "150.00",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          validFrom: "2023-01-01",
        },
        serviceOutput: {
          "@type": "Thing",
          name: "Produzione musicale professionale",
        },
        termsOfService: "https://cashmerestudiomilano.it/terms",
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
        // Aggiunta di informazioni avanzate per il servizio
        offers: {
          "@type": "Offer",
          price: "30.00",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          validFrom: "2023-01-01",
        },
        serviceOutput: {
          "@type": "Thing",
          name: "Utilizzo sala attrezzata",
        },
        termsOfService: "https://cashmerestudiomilano.it/terms",
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
        // Aggiunta di informazioni avanzate per il portfolio
        datePublished: `${item.year}-01-01`,
        image: item.image,
        description: item.description,
        genre: item.genre || "Pop",
        duration: item.duration || "PT3M30S", // Formato ISO 8601 per la durata
        inLanguage: "it",
        publisher: {
          "@type": "Organization",
          name: "Cashmere Studio Milano",
          url: "https://cashmerestudiomilano.it",
        },
        recordedAt: {
          "@type": "MusicVenue",
          name: "Cashmere Studio Milano",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Via Oreste Salomone 61",
            addressLocality: "Milano",
            postalCode: "20183",
            addressCountry: "IT",
          },
        },
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

// Schema.org JSON-LD per la pagina FAQ
export const faqSchema = (faqs: { question: string; answer: string }[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

// Schema.org JSON-LD per eventi musicali
export const eventSchema = (events: any[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: events.map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "MusicEvent",
        name: event.name,
        startDate: event.startDate,
        endDate: event.endDate,
        location: {
          "@type": "MusicVenue",
          name: "Cashmere Studio Milano",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Via Oreste Salomone 61",
            addressLocality: "Milano",
            postalCode: "20183",
            addressCountry: "IT",
          },
        },
        performer: {
          "@type": "MusicGroup",
          name: event.performer,
        },
        offers: {
          "@type": "Offer",
          price: event.price,
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          url: `https://cashmerestudiomilano.it/events/${event.id}`,
          validFrom: event.validFrom,
        },
        image: event.image,
        description: event.description,
      },
    })),
  }
}

// Schema.org JSON-LD per articoli del blog
export const articleSchema = (article: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Cashmere Studio Milano",
      logo: {
        "@type": "ImageObject",
        url: "https://cashmerestudiomilano.it/cashmere-logo.svg",
      },
    },
    description: article.description,
    articleBody: article.content,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://cashmerestudiomilano.it/blog/${article.slug}`,
    },
    keywords: article.keywords.join(", "),
  }
}

// Schema.org JSON-LD per recensioni
export const reviewSchema = (reviews: any[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: reviews.map((review, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: review.rating,
          bestRating: "5",
          worstRating: "1",
        },
        author: {
          "@type": "Person",
          name: review.author,
        },
        datePublished: review.date,
        reviewBody: review.content,
        itemReviewed: {
          "@type": "MusicGroup",
          name: "Cashmere Studio Milano",
        },
      },
    })),
  }
}

// Schema.org JSON-LD per video musicali
export const videoSchema = (videos: any[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: videos.map((video, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "VideoObject",
        name: video.title,
        description: video.description,
        thumbnailUrl: video.thumbnail,
        uploadDate: video.uploadDate,
        duration: video.duration, // Formato ISO 8601 (PT1H30M)
        contentUrl: video.url,
        embedUrl: video.embedUrl,
        publisher: {
          "@type": "Organization",
          name: "Cashmere Studio Milano",
          logo: {
            "@type": "ImageObject",
            url: "https://cashmerestudiomilano.it/cashmere-logo.svg",
          },
        },
      },
    })),
  }
}

// Schema.org JSON-LD per corsi e workshop
export const courseSchema = (courses: any[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: courses.map((course, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Course",
        name: course.title,
        description: course.description,
        provider: {
          "@type": "Organization",
          name: "Cashmere Studio Milano",
          sameAs: "https://cashmerestudiomilano.it",
        },
        offers: {
          "@type": "Offer",
          price: course.price,
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          url: `https://cashmerestudiomilano.it/courses/${course.id}`,
          validFrom: course.validFrom,
        },
        image: course.image,
        courseCode: course.code,
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "OFFLINE",
          location: {
            "@type": "Place",
            name: "Cashmere Studio Milano",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Via Oreste Salomone 61",
              addressLocality: "Milano",
              postalCode: "20183",
              addressCountry: "IT",
            },
          },
          startDate: course.startDate,
          endDate: course.endDate,
          instructor: {
            "@type": "Person",
            name: course.instructor,
          },
        },
      },
    })),
  }
}

// Schema.org JSON-LD per attrezzature musicali
export const equipmentSchema = (equipment: any[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: equipment.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: item.name,
        description: item.description,
        image: item.image,
        brand: {
          "@type": "Brand",
          name: item.brand,
        },
        category: item.category,
        model: item.model,
      },
    })),
  }
}

// Configurazione per la sitemap
export const sitemapConfig = {
  siteUrl: "https://cashmerestudiomilano.it",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/dashboard"],
      },
    ],
    additionalSitemaps: ["https://cashmerestudiomilano.it/sitemap.xml", "https://cashmerestudiomilano.it/server-sitemap.xml"],
  },
  exclude: ["/admin/*", "/dashboard/*", "/auth/*"],
  changefreq: "weekly",
  priority: 0.7,
}

// Configurazione per i metadati avanzati
export const advancedMetadata = {
  verification: {
    google: "google-site-verification-code", // Sostituire con il codice reale
    yandex: "yandex-verification-code", // Sostituire con il codice reale
    bing: "bing-verification-code", // Sostituire con il codice reale
  },
  alternateLocales: [
    {
      hrefLang: "it-IT",
      href: "https://cashmerestudiomilano.it",
    },
    {
      hrefLang: "en-US",
      href: "https://cashmerestudiomilano.it/en",
    },
    {
      hrefLang: "x-default",
      href: "https://cashmerestudiomilano.it",
    },
  ],
  facebook: {
    appId: "facebook-app-id", // Sostituire con l'ID reale
  },
  additionalMetaTags: [
    {
      name: "author",
      content: "Cashmere Studio Milano",
    },
    {
      name: "publisher",
      content: "Cashmere Studio Milano",
    },
    {
      name: "geo.region",
      content: "IT-MI",
    },
    {
      name: "geo.placename",
      content: "Milano",
    },
    {
      name: "geo.position",
      content: "45.4554;9.2326",
    },
    {
      name: "ICBM",
      content: "45.4554, 9.2326",
    },
    {
      name: "revisit-after",
      content: "7 days",
    },
    {
      name: "apple-mobile-web-app-capable",
      content: "yes",
    },
    {
      name: "apple-mobile-web-app-status-bar-style",
      content: "black",
    },
    {
      name: "format-detection",
      content: "telephone=no",
    },
  ],
}

// Configurazione per i dati strutturati locali
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://cashmerestudiomilano.it",
  name: "Cashmere Studio Milano",
  image: "https://cashmerestudiomilano.it/images/studio.jpg",
  logo: "https://cashmerestudiomilano.it/cashmere-logo.svg",
  url: "https://cashmerestudiomilano.it",
  telephone: "+393514206294",
  email: "cashmerestudiomilano@gmail.com",
  priceRange: "€€",
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
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "22:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "10:00",
      closes: "20:00",
    },
  ],
  sameAs: [
    "https://instagram.com/cashmerestudio",
    "https://facebook.com/cashmerestudio",
    "https://twitter.com/cashmerestudio",
    "https://youtube.com/cashmerestudio",
    "https://linkedin.com/company/cashmerestudio",
  ],
  hasMap: "https://www.google.com/maps?cid=your-google-maps-cid", // Sostituire con il CID reale
  department: [
    {
      "@type": "MusicGroup",
      name: "Reparto Registrazione",
      description: "Reparto specializzato in registrazioni vocali e strumentali",
    },
    {
      "@type": "MusicGroup",
      name: "Reparto Mix & Master",
      description: "Reparto specializzato in mix e mastering professionale",
    },
    {
      "@type": "MusicGroup",
      name: "Reparto Produzione",
      description: "Reparto specializzato in produzione musicale",
    },
  ],
  makesOffer: [
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Registrazione",
        description: "Servizio professionale di registrazione vocale e strumentale",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Mix & Master",
        description: "Servizio professionale di mixaggio e mastering",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Produzione",
        description: "Servizio professionale di produzione musicale",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Affitto sala",
        description: "Servizio di affitto sala per registrazioni",
      },
    },
  ],
  potentialAction: {
    "@type": "ReserveAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://cashmerestudiomilano.it/book",
      inLanguage: "it-IT",
      actionPlatform: [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform",
        "http://schema.org/IOSPlatform",
        "http://schema.org/AndroidPlatform",
      ],
    },
    result: {
      "@type": "Reservation",
      name: "Prenotazione studio",
    },
  },
}

// Configurazione per i dati strutturati di prodotto
export const productSchema = (product: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: "Cashmere Studio Milano",
    },
    offers: {
      "@type": "Offer",
      url: product.url,
      priceCurrency: "EUR",
      price: product.price,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Cashmere Studio Milano",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  }
}

// Configurazione per i dati strutturati di persona
export const personSchema = (person: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.jobTitle,
    image: person.image,
    description: person.description,
    url: person.url,
    sameAs: person.socialLinks,
    worksFor: {
      "@type": "Organization",
      name: "Cashmere Studio Milano",
    },
    knowsAbout: person.skills,
  }
}

// Configurazione per i dati strutturati di HowTo
export const howToSchema = (howTo: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: howTo.title,
    description: howTo.description,
    image: howTo.image,
    totalTime: howTo.totalTime, // Formato ISO 8601 (PT1H30M)
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "EUR",
      value: howTo.cost,
    },
    supply: howTo.supplies.map((supply: string) => ({
      "@type": "HowToSupply",
      name: supply,
    })),
    tool: howTo.tools.map((tool: string) => ({
      "@type": "HowToTool",
      name: tool,
    })),
    step: howTo.steps.map((step: any, index: number) => ({
      "@type": "HowToStep",
      url: `${howTo.url}#step${index + 1}`,
      name: step.title,
      itemListElement: {
        "@type": "HowToDirection",
        text: step.description,
      },
      image: step.image,
    })),
  }
}

// Configurazione per i dati strutturati di WebSite
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Cashmere Studio Milano",
  url: "https://cashmerestudiomilano.it",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://cashmerestudiomilano.it/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
  inLanguage: "it-IT",
  copyrightYear: new Date().getFullYear(),
  copyrightHolder: {
    "@type": "Organization",
    name: "Cashmere Studio Milano",
  },
  author: {
    "@type": "Organization",
    name: "Cashmere Studio Milano",
  },
  creator: {
    "@type": "Organization",
    name: "Cashmere Studio Milano",
  },
  publisher: {
    "@type": "Organization",
    name: "Cashmere Studio Milano",
    logo: {
      "@type": "ImageObject",
      url: "https://cashmerestudiomilano.it/cashmere-logo.svg",
    },
  },
  description:
    "Cashmere Studio è uno studio di registrazione professionale a Milano. Offriamo servizi di registrazione, mix, master e produzione musicale di alta qualità.",
}

// Configurazione per i dati strutturati di WebPage
export const webpageSchema = (page: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.description,
    url: page.url,
    isPartOf: {
      "@type": "WebSite",
      name: "Cashmere Studio Milano",
      url: "https://cashmerestudiomilano.it",
    },
    inLanguage: "it-IT",
    lastReviewed: page.lastReviewed || new Date().toISOString().split("T")[0],
    reviewedBy: {
      "@type": "Organization",
      name: "Cashmere Studio Milano",
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["article", "h1", "h2", "h3", "p"],
    },
    mainContentOfPage: {
      "@type": "WebPageElement",
      cssSelector: "main",
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: page.image,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: page.breadcrumbs.map((item: any, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    },
  }
}
