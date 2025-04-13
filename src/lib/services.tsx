import type React from "react"
import { Mic, Sliders, Music } from "lucide-react"
import Image from "next/image"
export interface ServiceFeature {
  icon: React.ReactNode
  title: string
}

export interface Service {
  id: string
  title: string
  bgImageUrl: string
  icon: React.ReactNode
  content: React.ReactNode
}

export const services: Service[] = [
  {
    id: "1",
    title: "Registrazione",
    bgImageUrl: "/rec.png",
    icon: <Image width={30} height={30} src="/Microfono.svg" alt="Registrazione"/>,
    content: (
      <div className="">
        <h2 className="poppins-medium text-xl mb-4">Nelle nostre ore di registrazione sono compresi:</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-b-1 border-b-gray pb-16">
          {[
            {
              icon: <Image width={30} height={30} src="/engineer.svg" alt="Fonico"/>,
              title: "Un fonico del team Cashmere",
            },
            {
                icon: <Image width={30} height={30} src="/tune.svg" alt="Autotune"/>,
              title: "L'uso dell'autotune",
            },
            {
                icon: <Image width={30} height={30} src="/setting.svg" alt="Pre-mix"/>,
              title: "Un pre-mix alla canzone",
            },
          ].map((feature, index) => (
            <div key={index} className="p-6 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                {feature.icon}
                <span className="font-medium">{feature.title}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 mt-16 border-b border-b-1 border-b-gray pb-16">
          <h2 className="text-2xl font-bold mb-4">Descrizione del servizio</h2>
          <p className="text-muted-foreground">
            La fase di registrazione è quella in cui l'artista viene al microfono e registra le sue parti vocali. Il
            fonico si occupa di posizionare i microfoni, regolare i livelli audio e assicurarsi che la qualità della
            registrazione sia ottimale.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "2",
    title: "Mix & Master",
    bgImageUrl: "/mixmaster.png",
    icon: <Image width={30} height={30} src="/Mix & Master.svg" alt="Mix & Master"/>,
    content: (
      <div className="space-y-8 mb-16">
        <div>
          <h2 className="text-2xl font-bold">Descrizione del servizio</h2>
          <p className="text-muted-foreground mt-4">
            La fase di registrazione è quella in cui l'artista viene al microfono e registra le sue parti vocali. Il
            fonico si occupa di posizionare i microfoni, regolare i livelli audio e assicurarsi che la qualità della
            registrazione sia ottimale.
          </p>
        </div>

        <div>
          <h3 className="poppins-semibold mb-4">Informazioni aggiuntive</h3>
          <ul className="space-y-4 text-muted-foreground">
            <li><span className="text-white">..</span>• <span className="text-white">..</span>Un Mix Master può essere fatto soltanto dopo che la fase di registrazione è conclusa.</li>
            <li>
            <span className="text-white">..</span>• <span className="text-white">..</span> Il Mix Master può essere eseguito sia che le registrazioni siano state fatte direttamente nel nostro
              studio, sia che siano state fatte in un altro studio di registrazione.
            </li>
            <li>
            <span className="text-white">..</span>• <span className="text-white">..</span> Nel caso le registrazioni siano state fatte altrove, per poter eseguire il mix & master è necessario
              avere le{" "}
              <a href="#" className="underline">
                steams delle voci
              </a>
              .
            </li>
            <li>
            <span className="text-white">..</span>• <span className="text-white">..</span> Per fare il mix è necessario che le steams siano mandate dry, ovvero{" "}
              <a href="#" className="underline">
                senza nessun effetto
              </a>
              .
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "3",
    title: "Produzione",
    bgImageUrl: "/prod.png",
    icon: <Image width={30} height={30} src="/Produzione.svg" alt="Produzione"/>,
    content: (
      <div className="space-y-4 mb-16">
        <h2 className="text-2xl font-bold">Descrizione del servizio</h2>
        <p className="text-muted-foreground">
          Il nostro servizio di produzione musicale offre beat personalizzati di alta qualità. Perfetti per ogni genere
          musicale, e realizzati su misura per valorizzare le idee dell'artista.
        </p>
      </div>
    ),
  },
]

