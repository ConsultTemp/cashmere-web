import Head from "next/head"

interface CanonicalLinkProps {
  url: string
  alternateUrls?: { hrefLang: string; href: string }[]
}

export default function CanonicalLink({ url, alternateUrls }: CanonicalLinkProps) {
  return (
    <Head>
      <link rel="canonical" href={url} />
      {alternateUrls?.map((alternate, index) => (
        <link key={index} rel="alternate" hrefLang={alternate.hrefLang} href={alternate.href} />
      ))}
    </Head>
  )
}
