"use client"
import { Instagram, Phone } from "lucide-react"
import { Textarea } from "@/components/TextArea"
import { Input } from "@/components/Input"
import { BackButton } from "../components/BackButton"
import { SummaryContent } from "../components/BookingSummary"
import { useBookingStore } from "../../../store/booking-store"
import { BookButton } from "../components/BookButton"

export default function ContactPage() {
  const { instagramUsername, phoneNumber, notes, setContactInfo } = useBookingStore()

  // Check if required fields are filled
  const isFormValid = instagramUsername.trim() !== "" && phoneNumber.trim() !== ""

  return (
    <div className="container max-w-3xl py-8 pb-32">
      <div className="flex justify-between items-center">
        <BackButton href="/book/engineer" />
      </div>

      <div className="mt-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">L'ultimo step!</h1>
          <p className="text-gray-400 mt-2">Inserisci i tuoi contatti</p>
          <p className="text-gray-400 mt-1">Ci serviranno per confermare la sessione.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome utente di Instagram</label>
              <div className="relative">
                <Instagram className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="@nomeutente"
                  className="pl-10"
                  value={instagramUsername}
                  onChange={(e) => setContactInfo(e.target.value, phoneNumber, notes)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Numero di telefono</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="tel"
                  placeholder="Numero di telefono"
                  className="pl-10"
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
                className="min-h-[100px]"
                value={notes}
                onChange={(e) => setContactInfo(instagramUsername, phoneNumber, e.target.value)}
              />
            </div>
          </div>
          <div>
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

