import Head from "next/head"

interface OpenGraphProps {
  title: string
  description: string
  url: string
  type?: string
  image?: string
  siteName?: string
  locale?: string
}

export default function OpenGraph({
  title,
  description,
  url,
  type = "website",
  image = "/og-image.jpg",
  siteName = "Cashmere Studio Milano",
  locale = "it_IT",
}: OpenGraphProps) {
  return (
    <Head>
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@cashmerestudio" />
      <meta name="twitter:creator" content="@cashmerestudio" />
    </Head>
  )
}
