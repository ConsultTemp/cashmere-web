import StudioCard, { type StudioCardProps } from "../StudioCard"

const studios: StudioCardProps[] = [
  {
    title: "STUDIO 1",
    subtitle: "Il nostro studio di punta.",
    badge: "#1 Il più richiesto",
    imageUrl: "/Studio 1/4.jpg",
    id: "1",
  },
  {
    title: "STUDIO 2",
    subtitle: "Garantisce registrazioni di massima qualità.",
    imageUrl: "/Studio 2/2.jpg",
    id: "2",
  },
  {
    title: "STUDIO 3",
    subtitle: "Studio ideale per momenti creativi.",
    imageUrl: "/Studio 3/4.jpg",
    id: "3",
  },
  {
    title: "STUDIO 4",
    subtitle: "Nessuna descrizione",
    imageUrl: "/Studio 1/1.jpg",
    id: "4",
  },
]

export const StudiosSection = () => {
  return (
    <div className="w-full">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 poppins-semibold">I nostri studi</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {studios.map((card, index) => (
          <div key={index} className="">
            <StudioCard {...card} />
          </div>
        ))}
      </div>
    </div>
  )
}

