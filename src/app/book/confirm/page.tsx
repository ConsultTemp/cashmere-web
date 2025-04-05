"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/Button"
import { BackButton } from "../components/BackButton"
import { SummaryContent } from "../components/BookingSummary"
import { useBookingStore } from "@/store/booking-store"
import { useUserStore } from "@/store/user-store"
import { useBooking } from "@/hooks/useBooking"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function ConfirmPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const { user } = useUserStore()
  const { createBooking } = useBooking()

  const {
    selectedEngineer,
    selectedStudio,
    selectedServices,
    selectedDate,
    timeTo,
    timeFrom,
    selectedPackage,
    instagramUsername,
    phoneNumber,
    notes,
    loadBookingFromLocalStorage,
    resetBooking,
  } = useBookingStore()

  // Carica i dati della prenotazione dal localStorage
  useEffect(() => {
    loadBookingFromLocalStorage()
  }, [loadBookingFromLocalStorage])

  const handleSubmitBooking = async () => {
    setIsSubmitting(true)
    setError("")

    try {
      // Crea l'oggetto prenotazione
      const booking = {
        userId: user.id || null, // Può essere null per prenotazioni anonime
        fonicoId: selectedEngineer || "", // Ingegnere predefinito se non selezionato
        studioId: selectedStudio,
        start: new Date(selectedDate),
        end: new Date(selectedDate),
        services: selectedPackage ? [...selectedServices, selectedPackage] : selectedServices,
        notes: notes,
        phone: phoneNumber,
        instagram: instagramUsername,
      }

      // Imposta ore e minuti
      if (timeFrom) {
        const [hours, minutes] = timeFrom.split(":").map(Number)
        booking.start.setHours(hours, minutes, 0, 0)
      }

      if (timeTo) {
        const [hours, minutes] = timeTo.split(":").map(Number)
        booking.end.setHours(hours, minutes, 0, 0)
      }

      console.log("Invio prenotazione:", booking)
      const result = await createBooking(booking)

      if (result) {
        // Pulisci il localStorage dopo una prenotazione riuscita
        localStorage.removeItem("bookingData")
        localStorage.removeItem("bookingInProgress")

        // Resetta lo store della prenotazione
        resetBooking()

        // Reindirizza alla dashboard o alla home
        router.push(user.id ? "/dashboard" : "/")
      }
    } catch (error) {
      console.error("Errore durante la creazione della prenotazione:", error)
      setError("Si è verificato un errore durante l'invio della prenotazione. Riprova più tardi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-3xl py-8 pb-32">
      <div className="flex justify-between items-center">
        <BackButton href="/book/contact" />
      </div>

      <div className="mt-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Conferma prenotazione</h1>
          <p className="text-gray-400 mt-2">Controlla i dettagli e conferma la tua prenotazione</p>
        </div>

        <div className="space-y-6">
          <div>
            <h6 className="font-bold mb-4">Riepilogo prenotazione</h6>
            <SummaryContent />
          </div>

          <div className="space-y-2">
            <h6 className="font-bold">Contatti</h6>
            <p>
              <strong>Instagram:</strong> {instagramUsername}
            </p>
            <p>
              <strong>Telefono:</strong> {phoneNumber}
            </p>
            {notes && (
              <>
                <h6 className="font-bold mt-4">Note</h6>
                <p>{notes}</p>
              </>
            )}
          </div>

          {error && <div className="p-4 bg-red-50 text-red-600 rounded-md">{error}</div>}

          <div className="flex flex-col items-end">
            <Button variant="gradient" onClick={handleSubmitBooking} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Invio in corso...
                </>
              ) : (
                "Conferma prenotazione"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

