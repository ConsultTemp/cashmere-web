"use client"

import Link from "next/link"
import { Button } from "@/components/Button"
import { BackButton } from "../components/BackButton"
import { BookingSummary } from "../components/BookingSummary"
import { StudioCard } from "./components/StudioCard"
import { useBookingStore } from "../../../store/booking-store"
import { useEffect, useState } from "react"
import { useBooking } from "@/hooks/useBooking"
import { studios as studioDetails } from "@/lib/studios" // Dettagli completi degli studi
import { format } from "date-fns"
import { it } from "date-fns/locale"

interface DateAlternative {
  timeRange: string
  date: string
}

interface UnavailabilityInfo {
  alternativeDates: DateAlternative[]
  occupiedTime: string
}

export default function StudioPage() {
  const { selectedStudio, setSelectedStudio, timeFrom, timeTo, selectedDate } = useBookingStore()
  const { getAvailableStudios } = useBooking()

  const [availableStudios, setAvailableStudios] = useState<any[]>([]) // Gli studi disponibili
  const [unavailableStudios, setUnavailableStudios] = useState<any[]>([]) // Gli studi non disponibili
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadStudios = async () => {
      try {
        if (!selectedDate || !timeFrom || !timeTo) return

        setIsLoading(true)

        const [fromHours, fromMinutes] = timeFrom.split(":").map(Number)
        const [toHours, toMinutes] = timeTo.split(":").map(Number)

        const start = new Date(selectedDate)
        start.setHours(fromHours)
        start.setMinutes(fromMinutes)
        start.setSeconds(0)
        start.setMilliseconds(0)

        const end = new Date(selectedDate)
        end.setHours(toHours)
        end.setMinutes(toMinutes)
        end.setSeconds(0)
        end.setMilliseconds(0)

        // Recuperiamo gli studi disponibili per il periodo
        const studioAvailability = await getAvailableStudios(start, end)
        console.log("Studio availability:", studioAvailability)

        // Formatta l'orario richiesto per mostrarlo nei messaggi di indisponibilità
        const requestedTimeRange = `${timeFrom} - ${timeTo}`

        // Studi disponibili
        const available = []
        // Studi non disponibili
        const unavailable = []

        // Elabora i dati di disponibilità e combina con i dettagli degli studi
        for (const studioAvail of studioAvailability) {
          // Trova i dettagli completi dello studio
          const studioDetail = studioDetails.find((s) => s.dbId === studioAvail.id)

          if (!studioDetail) continue // Salta se non troviamo i dettagli

          const studioData = {
            id: studioAvail.id,
            name: studioDetail.name,
            description: studioDetail.description.join(" "),
            image: studioDetail.imagesUrl[0] || "",
          }

          if (studioAvail.isAvailable) {
            // Studio disponibile
            available.push(studioData)
          } else {
            // Studio non disponibile - prepara le alternative
            const alternativeDates: DateAlternative[] = []

            if (studioAvail.alternativeSlots && studioAvail.alternativeSlots.length > 0) {
              // Converti gli slot alternativi nel formato richiesto
              studioAvail.alternativeSlots.forEach(
                (slot: { start: string | number | Date; end: string | number | Date }) => {
                  const startDate = new Date(slot.start)
                  const endDate = new Date(slot.end)

                  const formattedDate = format(startDate, "EEEE d MMMM", { locale: it })
                  const formattedTimeRange = `${format(startDate, "HH:mm")} - ${format(endDate, "HH:mm")}`

                  alternativeDates.push({
                    date: formattedDate,
                    timeRange: formattedTimeRange,
                  })
                },
              )
            }

            unavailable.push({
              ...studioData,
              unavailabilityInfo: {
                alternativeDates,
                occupiedTime: requestedTimeRange,
              },
            })
          }
        }

        setAvailableStudios(available)
        setUnavailableStudios(unavailable)
      } catch (error) {
        console.error("Error loading studios:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStudios()
  }, [selectedDate, timeFrom, timeTo])

  return (
    <div className="container max-w-3xl py-6 sm:py-8 px-4 sm:px-6 pb-20 sm:pb-32">
      <div className="flex justify-between items-center">
        <BackButton href="/book/datetime" />
        <BookingSummary />
      </div>

      <div className="mt-4 sm:mt-6 space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Quale sala vuoi affittare?</h1>
          <p className="text-muted-foreground mt-2">Seleziona la sala che desideri.</p>
        </div>

        {isLoading ? (
          <div className="py-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Verificando la disponibilità degli studi...</p>
          </div>
        ) : (
          <>
            {/* Studi disponibili */}
            {availableStudios.length > 0 && (
              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-4">Studi disponibili nella tua fascia oraria</h2>
                <div className="space-y-4">
                  {availableStudios.map((studio) => (
                    <StudioCard
                      key={studio.id}
                      id={studio.id}
                      name={studio.name}
                      description={studio.description}
                      image={studio.image}
                      isSelected={selectedStudio === studio.id}
                      onSelect={setSelectedStudio}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Studi non disponibili */}
            {unavailableStudios.length > 0 && (
              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-4">Studi non disponibili nella tua fascia oraria</h2>
                <div className="space-y-4">
                  {unavailableStudios.map((studio) => (
                    <StudioCard
                      key={studio.id}
                      id={studio.id}
                      name={studio.name}
                      description={studio.description}
                      image={studio.image}
                      isUnavailable={true}
                      unavailabilityInfo={studio.unavailabilityInfo}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div className="flex justify-end">
          <Button
            size="lg"
            asChild
            variant="gradient"
            className="px-8 sm:px-12 py-4 sm:py-6"
            disabled={!selectedStudio || isLoading}
          >
            <Link href="/book/engineer">Avanti</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

