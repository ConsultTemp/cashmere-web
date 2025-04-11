import { ImageResponse } from "next/og"

// Route segment config
export const runtime = "edge"

// Image metadata
export const alt = "Cashmere Studio Milano - Studio di Registrazione Professionale"
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

// Image generation
export default async function Image() {
  // Font
  const interSemiBold = fetch(new URL("./fonts/GeistVF.woff", import.meta.url)).then((res) => res.arrayBuffer())

  return new ImageResponse(
    // ImageResponse JSX element
    <div
      style={{
        fontSize: 128,
        background: "black",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        padding: "40px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
          {/* Placeholder for logo SVG */}
          <rect width="24" height="24" rx="12" fill="white" />
          <path d="M6 12h12M12 6v12" stroke="black" strokeWidth="2" />
        </svg>
      </div>
      <div
        style={{
          fontSize: "60px",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "10px",
        }}
      >
        Cashmere Studio
      </div>
      <div
        style={{
          fontSize: "32px",
          opacity: 0.8,
          textAlign: "center",
        }}
      >
        Studio di Registrazione Professionale a Milano
      </div>
    </div>,
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      fonts: [
        {
          name: "Inter",
          data: await interSemiBold,
          style: "normal",
          weight: 600,
        },
      ],
    },
  )
}
