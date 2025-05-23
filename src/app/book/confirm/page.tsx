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
import { useUser } from "@/hooks/useUser"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select"

export default function ConfirmPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [users, setUsers] = useState<any[]>([])
  const { user } = useUserStore()

  const [selectedUserId, setSelectedUserId] = useState<string>()
  const { createBooking } = useBooking()
  const { getManagers } = useUser()

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
   const isManager = user.role === "MANAGER"

  const [confirmationSent, setConfirmationSent] = useState(false)

  useEffect(() => {
    async function fetchData() {
      if (isManager) {
        const usersData = await getManagers(user.id)
        setUsers(usersData)
      }
    }
    
    fetchData()
  }, [user.id, isManager])

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
        userId: isManager ? selectedUserId : user.id || null, // Può essere null per prenotazioni anonime
        fonicoId: selectedEngineer || "", // Ingegnere predefinito se non selezionato
        studioId: selectedStudio,
        //@ts-ignore
        start: new Date(selectedDate),
        //@ts-ignore
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
      //@ts-ignore
      const result = await createBooking(booking)

      if (result) {
        // Pulisci il localStorage dopo una prenotazione riuscita
        localStorage.removeItem("bookingData")
        localStorage.removeItem("bookingInProgress")

        // Resetta lo store della prenotazione
        resetBooking()

        // Set the confirmation state to true
        setIsSubmitting(false)
        setConfirmationSent(true)
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
    <div className="container max-w-3xl py-8 pb-32 relative">
      {/* Full page loading overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Invio prenotazione in corso...</p>
            <p className="text-sm text-muted-foreground mt-2">Attendere prego, non chiudere questa pagina.</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <BackButton href="/book/contact" disabled={isSubmitting} />
      </div>

      <div className="mt-6 space-y-8">
        <div>
          <h1 className="text-3xl poppins-semibold">Conferma prenotazione</h1>
          <p className="text-gray-400 mt-2">Controlla i dettagli e conferma la tua prenotazione</p>
        </div>

        {/* Nuova select per filtrare per utente - visibile solo per manager */}
        {isManager && (
              <div className="flex items-center">
                <label htmlFor="userFilter" className="mr-2 text-sm font-medium">
                  Filtra per utente:
                </label>
                <Select defaultValue="all" onValueChange={(value) => setSelectedUserId(value)}>
                  <SelectTrigger className="w-60">
                    <SelectValue placeholder="Seleziona utente" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((userItem) => (
                      <SelectItem key={userItem.id} value={userItem.id}>
                        {userItem.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

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
            <Button variant="gradient" onClick={handleSubmitBooking} disabled={isSubmitting || (isManager && !selectedUserId)}>
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

      {confirmationSent ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold">Prenotazione inviata!</h2>
          <p>Verrai rimandato alla pagina richiesta.</p>
        </div>
      ) : (
        // ... existing content ...
        <div></div>
      )}
    </div>
  )
}
