"use client"
import { Instagram, Phone } from "lucide-react"
import { Textarea } from "@/components/TextArea"
import Image from "next/image"
import { Input } from "@/components/Input"
import { SummaryContent } from "../components/BookingSummary"
import { useBookingStore } from "../../../store/booking-store"
import { BookButton } from "../components/BookButton"
import { useRouter } from "next/navigation"
import whatsapp from '../../../../public/whatsapp.svg'
import instagram from '../../../../public/instagram.svg'
export default function ContactPage() {
  const { instagramUsername, phoneNumber, notes, setContactInfo, selectedServices } = useBookingStore()
  const router = useRouter()

  // Check if required fields are filled
  const isFormValid = instagramUsername.trim() !== "" && phoneNumber.trim() !== ""

  // Check if we should skip the engineer page when going back
  const shouldSkipEngineerPage = () => {
    //@ts-ignore
    return selectedServices.length === 1 && selectedServices.includes("wtscbdf9xv7qkz0m2y4nlgr3p")
  }

  // Handle back button click
  const handleBackClick = () => {
    if (shouldSkipEngineerPage()) {
      router.push("/book/studio")
    } else {
      router.push("/book/engineer")
    }
  }

  return (
    <div className="container max-w-3xl py-8 pb-32">
      <div className="flex justify-between items-center">
        <button onClick={handleBackClick} className="flex items-center text-sm font-medium text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1 h-4 w-4"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Indietro
        </button>
      </div>

      <div className="mt-6">
        <div>
          <h1 className="text-3xl poppins-semibold">L'ultimo step!</h1>
          <p className="text-3xl poppins-semibold mt-1">Inserisci i tuoi contatti</p>
          <p className="text-gray-400 mt-1">Ci serviranno per confermare la sessione.</p>
        </div>

        <div className="mt-12">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome utente di Instagram</label>
              <div className="relative">
              <Image src={instagram} alt="Whatsapp logo" className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
                <Input
                  placeholder="@nomeutente"
                  className="pl-10 focus-visible:ring-0"
                  value={instagramUsername}
                  onChange={(e) => setContactInfo(e.target.value, phoneNumber, notes)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Numero di telefono</label>
              <div className="relative">
                <Image src={whatsapp} alt="Whatsapp logo" className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
                <Input
                  type="tel"
                  placeholder="Numero di telefono"
                  className="pl-10 focus-visible:ring-0"
                  value={phoneNumber}
                  onChange={(e) => setContactInfo(instagramUsername, e.target.value, notes)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Note sulla sessione <span className="text-gray-400">(facoltativo)</span>
              </label>
              <Textarea
                placeholder="Es. Indicazione per il fonico, preferenze sul microfono, dettagli vari..."
                className="min-h-[100px] focus-visible:ring-0"
                value={notes}
                onChange={(e) => setContactInfo(instagramUsername, phoneNumber, e.target.value)}
              />
            </div>
          </div>
          <div className="mt-12 mb-6">
            <h6 className="font-bold mb-4">Riepilogo prenotazione</h6>
            <SummaryContent />
          </div>
          <div className="flex flex-col items-end">
            <BookButton disabled={!isFormValid} />
          </div>
        </div>
      </div>
    </div>
  )
}
