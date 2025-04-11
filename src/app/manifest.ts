import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cashmere Studio Milano",
    short_name: "Cashmere Studio",
    description: "Studio di registrazione professionale a Milano",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/maskable-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    related_applications: [
      {
        platform: "play",
        url: "https://play.google.com/store/apps/details?id=it.cashmerestudio.app",
        id: "it.cashmerestudio.app",
      },
      {
        platform: "itunes",
        url: "https://apps.apple.com/app/cashmere-studio/id123456789",
      },
    ],
    prefer_related_applications: false,
    shortcuts: [
      {
        name: "Prenota",
        short_name: "Prenota",
        description: "Prenota una sessione",
        url: "/book",
        icons: [{ src: "/icons/book.png", sizes: "192x192" }],
      },
      {
        name: "Portfolio",
        short_name: "Portfolio",
        description: "Visualizza il nostro portfolio",
        url: "/portfolio",
        icons: [{ src: "/icons/portfolio.png", sizes: "192x192" }],
      },
    ],
    categories: ["music", "business", "entertainment"],
    screenshots: [
      {
        src: "/screenshots/home.jpg",
        sizes: "1280x720",
        type: "image/jpeg",
        platform: "macos",
        label: "Homepage di Cashmere Studio Milano",
      },
      {
        src: "/screenshots/portfolio.jpg",
        sizes: "1280x720",
        type: "image/jpeg",
        platform: "macos",
        label: "Portfolio di Cashmere Studio Milano",
      },
    ],
    orientation: "any",
    lang: "it-IT",
    dir: "ltr",
  }
}
