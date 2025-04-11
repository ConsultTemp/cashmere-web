import type { MetadataRoute } from "next"

// Funzione per generare il file robots.txt
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/dashboard/", "/auth/"],
    },
    sitemap: "https://cashmerestudio.it/sitemap.xml",
    host: "https://cashmerestudio.it",
  }
}
