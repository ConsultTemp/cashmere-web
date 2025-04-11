"use client"

import Link from "next/link"
import { Button } from "@/components/Button"
import { BackButton } from "../components/BackButton"
import { BookingSummary } from "../components/BookingSummary"
import { EngineerCard } from "./components/EngineerCard"
import { useBookingStore } from "../../../store/booking-store"
import { useEffect, useState } from "react"
import { useBooking } from "@/hooks/useBooking"
import { format } from "date-fns"
import { it } from "date-fns/locale"
import { useRouter } from "next/navigation"

interface DateAlternative {
  timeRange: string
  date: string
}

interface UnavailabilityInfo {
  alternativeDates: DateAlternative[]
  occupiedTime: string
}

export default function EngineerPage() {
  const {
    selectedEngineer,
    setSelectedEngineer,
    needsEngineer,
    setNeedsEngineer,
    timeFrom,
    timeTo,
    selectedDate,
    setSelectedDate,
    setTimeRange,
  } = useBookingStore()
  const { getAvailableEngineers } = useBooking()
  const router = useRouter()

  const [availableEngineers, setAvailableEngineers] = useState<any[]>([])
  const [unavailableEngineers, setUnavailableEngineers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [triggerReload, setTriggerReload] = useState(0)

  // Handle selecting alternative slots for engineers
  const handleSelectAlternativeSlot = (alt: { date: string; timeRange: string }, engineerId: string) => {
    try {
      // Parse the date string (e.g., "Lunedì 15 Aprile")
      const dateStr = alt.date
      console.log("Engineer page - Parsing date:", dateStr)

      // Extract day and month
      const parts = dateStr.split(" ")
      if (parts.length < 3) {
        console.error("Invalid date format:", dateStr)
        return
      }

      const day = Number.parseInt(parts[1], 10)
      const monthName = parts[2].toLowerCase() // Convert to lowercase for case-insensitive comparison

      // Map Italian month names to month numbers (0-based)
      const monthMap: Record<string, number> = {
        gennaio: 0,
        febbraio: 1,
        marzo: 2,
        aprile: 3,
        maggio: 4,
        giugno: 5,
        luglio: 6,
        agosto: 7,
        settembre: 8,
        ottobre: 9,
        novembre: 10,
        dicembre: 11,
      }

      const monthIndex = monthMap[monthName]
      if (monthIndex === undefined) {
        console.error("Invalid month name:", monthName)
        return
      }

      // Create a new date with the current year
      const newDate = new Date()
      newDate.setDate(day)
      newDate.setMonth(monthIndex)

      // Parse time range (e.g., "17:00 - 20:00")
      const [startTime, endTime] = alt.timeRange.split(" - ")

      console.log("Engineer page - Selected new date:", newDate)
      console.log("Engineer page - Selected new time range:", startTime, "to", endTime)

      // Update the booking store
      setSelectedDate(newDate)
      setTimeRange(startTime, endTime)

      // Pre-select the engineer
      //@ts-ignore
      setSelectedEngineer(engineerId)
      setNeedsEngineer(true)

      // Force reload of engineers with new time
      setTimeout(() => {
        setTriggerReload((prev) => prev + 1)
      }, 100)
    } catch (error) {
      console.error("Error parsing alternative slot:", error)
    }
  }

  useEffect(() => {
    const loadEngineers = async () => {
      try {
        if (!selectedDate || !timeFrom || !timeTo) return

        setIsLoading(true)
        console.log("Engineer page - Loading engineers with time:", timeFrom, timeTo, selectedDate.toISOString())

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

        console.log("Engineer page - API call with start:", start.toISOString(), "end:", end.toISOString())

        // Get available engineers
        const engineerAvailability = await getAvailableEngineers(start, end)
        console.log("Engineer availability:", engineerAvailability)

        // Format requested time range for unavailability messages
        const requestedTimeRange = `${timeFrom} - ${timeTo}`

        // Available engineers
        const available = []
        // Unavailable engineers
        const unavailable = []

        // Process availability data
        for (const engineerAvail of engineerAvailability) {
          const engineerData = {
            id: engineerAvail.id,
            name: engineerAvail.username,
          }

          if (engineerAvail.isAvailable) {
            // Engineer is available
            available.push(engineerData)
          } else {
            // Engineer is not available - prepare alternatives
            const alternativeDates: DateAlternative[] = []

            if (engineerAvail.alternativeSlots && engineerAvail.alternativeSlots.length > 0) {
              // Convert alternative slots to required format
              engineerAvail.alternativeSlots.forEach(
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
              ...engineerData,
              unavailabilityInfo: {
                alternativeDates,
                occupiedTime: requestedTimeRange,
              },
            })
          }
        }

        setAvailableEngineers(available)
        setUnavailableEngineers(unavailable)
      } catch (error) {
        console.error("Error loading engineers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadEngineers()
  }, [selectedDate, timeFrom, timeTo, triggerReload])

  return (
    <div className="container max-w-3xl py-6 sm:py-8 px-4 sm:px-6 pb-20 sm:pb-32">
      <div className="flex justify-between items-center">
        <BackButton href="/book/studio" />
        <BookingSummary />
      </div>

      <div className="mt-4 sm:mt-6 space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Vuoi un fonico?</h1>
          <p className="text-muted-foreground mt-2">Seleziona se desideri un fonico per la tua sessione.</p>
        </div>

        <div className="flex flex-col gap-4">
          <div
            className={`border rounded-lg p-4 cursor-pointer ${
              needsEngineer === false ? "border-primary bg-primary/5" : "border-border"
            }`}
            onClick={() => {
              setNeedsEngineer(false)
              //@ts-ignore
              setSelectedEngineer("")
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  needsEngineer === false ? "border-primary" : "border-muted-foreground"
                }`}
              >
                {needsEngineer === false && <div className="w-3 h-3 rounded-full bg-primary"></div>}
              </div>
              <span className="font-medium">No, non ho bisogno di un fonico</span>
            </div>
          </div>

          <div
            className={`border rounded-lg p-4 cursor-pointer ${
              needsEngineer === true ? "border-primary bg-primary/5" : "border-border"
            }`}
            onClick={() => setNeedsEngineer(true)}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  needsEngineer === true ? "border-primary" : "border-muted-foreground"
                }`}
              >
                {needsEngineer === true && <div className="w-3 h-3 rounded-full bg-primary"></div>}
              </div>
              <span className="font-medium">Sì, desidero un fonico</span>
            </div>
          </div>
        </div>

        {needsEngineer && (
          <div className="space-y-6">
            <h2 className="text-lg sm:text-xl font-semibold">Seleziona un fonico</h2>

            {isLoading ? (
              <div className="py-8 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Verificando la disponibilità dei fonici...</p>
              </div>
            ) : (
              <>
                {/* Available engineers */}
                {availableEngineers.length > 0 && (
                  <div>
                    <h3 className="text-base font-medium mb-4">Fonici disponibili nella tua fascia oraria</h3>
                    <div className="space-y-4">
                      {availableEngineers.map((engineer) => (
                        <EngineerCard
                          key={engineer.id}
                          //@ts-ignore
                          id={engineer.id}
                          name={engineer.name}
                          isSelected={selectedEngineer === engineer.id}
                          onSelect={() => setSelectedEngineer(engineer.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Unavailable engineers */}
                {unavailableEngineers.length > 0 && (
                  <div>
                    <h3 className="text-base font-medium mb-4">Fonici non disponibili nella tua fascia oraria</h3>
                    <div className="space-y-4">
                      {unavailableEngineers.map((engineer) => (
                        <EngineerCard
                          key={engineer.id}
                          //@ts-ignore
                          id={engineer.id}
                          name={engineer.name}
                          isUnavailable={true}
                          unavailabilityInfo={engineer.unavailabilityInfo}
                          onSelectAlternativeSlot={(alt) => handleSelectAlternativeSlot(alt, engineer.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {availableEngineers.length === 0 && unavailableEngineers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nessun fonico trovato per questa fascia oraria.
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            size="lg"
            asChild
            variant="gradient"
            className="px-8 sm:px-12 py-4 sm:py-6"
            disabled={isLoading || (needsEngineer && !selectedEngineer)}
          >
            <Link href="/book/contact">Avanti</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
