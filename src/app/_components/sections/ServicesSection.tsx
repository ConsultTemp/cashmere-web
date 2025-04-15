"use client"

import ServiceCard from "../ServiceCard"

const services = [
  {
    id: "0",
    title: "Affitto sala",
    description:
      "Cashmere Studio è il tuo punto di riferimento per la registrazione e la produzione musicale a Milano.",
    imageUrl: "/Affitto sala.jpg",
    hasStudioButtons: true,
  },
  {
    id: "1",
    title: "Registrazione",
    description:
      "La fase di registrazione è quella in cui l'artista viene al microfono e registra le sue parti vocali.",
    imageUrl: "/Registrazione.jpg",
  },
  {
    id: "2",
    title: "Mix & Master",
    description:
      "Processo finale di lavorazione sulla traccia, in breve è l'attività che serve per far suonare bene una canzone.",
    imageUrl: "/Mix&Master.jpg",
  },
  {
    id: "3",
    title: "Produzione",
    description:
      "Il nostro servizio di produzione musicale offre beat personalizzati di alta qualità su misura per l'artista.",
    imageUrl: "/Produzione.jpg",
  },
]

export default function ServicesSection(id: any) {
  console.log(id)
  return (
    <section>
      <h2 className="mb-8 sm:mb-8 text-2xl sm:text-3xl poppins-semibold">I nostri servizi</h2>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {services
          .filter((s) => s.id != id?.id)
          .map((service, index) => (
            <ServiceCard
              //@ts-ignore
              id={service.id}
              key={index}
              title={service.title}
              description={service.description}
              imageUrl={service.imageUrl}
              hasStudioButtons={service.hasStudioButtons}
            />
          ))}
      </div>
    </section>
  )
}

