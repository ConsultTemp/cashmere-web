import Image from "next/image"
import logo from "../../../../public/cashmere-color.svg"
export function Paragraph() {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 w-full md:w-3/4">
        <Image alt="Logo Cashmere studio" src={logo || "/placeholder.svg"} className="w-24 h-24 md:w-auto md:h-auto" />
        <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
          <h4 className="text-xl font-semibold w-full md:w-3/4">
            Cashmere Studio Milano trasforma le tue idee in realtà sonore.
          </h4>
          <p className="text-[#758A9C] text-base font-light">
            Cashmere Studio è il tuo punto di riferimento per la registrazione e la produzione musicale a Milano.
          </p>
        </div>
      </div>
    </div>
  )
}

