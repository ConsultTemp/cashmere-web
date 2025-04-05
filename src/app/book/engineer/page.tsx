"use client"

import Link from "next/link"
import { Button } from "@/components/Button"
import { BackButton } from "../components/BackButton"
import { BookingSummary } from "../components/BookingSummary"
import { EngineerCard } from "./components/EngineerCard"
import { type Engineer, useBookingStore } from "../../../store/booking-store"
import { format } from "date-fns"
import { it } from "date-fns/locale"
import { useEffect, useState } from "react"
import { useBooking } from "@/hooks/useBooking"
import { useUser } from "@/hooks/useUser"

interface EngineerCardProps {
  name: Engineer | "Primo fonico disponibile"
  isAvailable: boolean
  unavailabilityInfo?: UnavailabilityInfo
}
interface DateAlternative {
  timeRange: string
  date: string
}
interface UnavailabilityInfo {
  alternativeDates: DateAlternative[]
  message: string
}

const engineers: EngineerCardProps[] = [
  {
    name: "Primo fonico disponibile",
    isAvailable: true,
  },
  {
    name: "Sleza",
    isAvailable: true,
  },
  {
    name: "Tarantino",
    isAvailable: true,
  },
  {
    name: "Rivreck",
    isAvailable: true,
  },
  {
    name: "Nicholas Frey",
    isAvailable: true,
  },
  {
    name: "Emdi",
    isAvailable: false,
    unavailabilityInfo: {
      message: "Emdi non è disponibile nella fascia oraria selezionata.",
      alternativeDates: [
        { date: "Sab 25 Gen", timeRange: "10:00 - 13:00" },
        { date: "Dom 26 Gen", timeRange: "16:00 - 21:00" },
      ],
    },
  },
]

export default function EngineerPage() {
  const [engineers, setEngineers] = useState([])
  const [availableEngineers, setAvailableEngineers] = useState([])
  const [unavailableEngineers, setUnavailableEngineers] = useState([])
  const { needsEngineer, selectedEngineer, setNeedsEngineer, setSelectedEngineer, selectedDate, timeFrom, timeTo } =
    useBookingStore()
  const { getAvailableEngineers } = useBooking()
  const { getEngineers } = useUser()

  useEffect(() => {
    const loadStudios = async () => {
      try {
        if (!selectedDate || !timeFrom || !timeTo) return

        //setIsLoading(true)

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
        const studioAvailability = await getAvailableEngineers(start, end)
        const data = await getEngineers()
        setEngineers(data)

        // Formatta l'orario richiesto per mostrarlo nei messaggi di indisponibilità
        const requestedTimeRange = `${timeFrom} - ${timeTo}`

        // Studi disponibili
        const available = []
        // Studi non disponibili
        const unavailable = []

        // Elabora i dati di disponibilità e combina con i dettagli degli studi
        for (const studioAvail of studioAvailability) {
          // Trova i dettagli completi dello studio
          const studioDetail = data.find((s: { id: any }) => s.id === studioAvail.id)

          if (!studioDetail) continue // Salta se non troviamo i dettagli

          const studioData = {
            id: studioAvail.id,
            name: studioDetail.username,
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
        console.log("avaiable", available)
        console.log("unavaiable", unavailable)
        //@ts-ignore
        setAvailableEngineers(available)
        //@ts-ignore
        setUnavailableEngineers(unavailable)
      } catch (error) {
        console.error("Error loading studios:", error)
      }
    }

    loadStudios()
  }, [selectedDate, timeFrom, timeTo])

  return (
    <div className="container max-w-3xl py-6 sm:py-8 px-4 sm:px-6 pb-20 sm:pb-32">
      <div className="flex justify-between items-center">
        <BackButton href="/book/studio" />
        <BookingSummary />
      </div>

      <div className="mt-4 sm:mt-6 space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Desideri avere il fonico per la tua sessione?</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Se non ti serve un nostro fonico, seleziona "Voglio solo affittare la sala".
          </p>
        </div>

        <div className="space-y-4">
          <EngineerCard
            name="Desidero il fonico"
            isSelected={needsEngineer}
            onSelect={() => {
              setNeedsEngineer(true)
              setSelectedEngineer(null)
            }}
          />

          <EngineerCard
            name="No, voglio solo affittare la sala"
            isSelected={!needsEngineer}
            onSelect={() => {
              setNeedsEngineer(false)
              setSelectedEngineer(null)
            }}
          />
        </div>

        {needsEngineer && (
          <>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Fonici disponibili nella tua fascia oraria</h2>
              <div className="space-y-4">
                {availableEngineers.map((eng) => (
                  <EngineerCard
                  //@ts-ignore
                    key={eng.name}
                    //@ts-ignore
                    name={eng.name}
                    //@ts-ignore
                    isSelected={selectedEngineer === eng.name}
                    //@ts-ignore
                    onSelect={() => setSelectedEngineer(eng.name)}
                  />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Fonici non disponibili nella tua fascia oraria</h2>
              <div className="space-y-4">
                {unavailableEngineers.map((eng) => (
                  <EngineerCard
                  //@ts-ignore
                    key={eng.name}
                    //@ts-ignore
                    name={eng.name}
                    isUnavailable
                    //@ts-ignore
                    unavailabilityInfo={eng.unavailabilityInfo}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end">
          <Button
            variant="gradient"
            size="lg"
            asChild
            className="px-8 sm:px-12 py-4 sm:py-6"
            disabled={needsEngineer && !selectedEngineer}
          >
            <Link href="/book/contact">Avanti</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

