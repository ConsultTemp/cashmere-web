"use client"

import { forwardRef, useRef, useState, useImperativeHandle, useEffect, useCallback } from "react"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import itLocale from "@fullcalendar/core/locales/it"
import { format } from "date-fns"
import { Button } from "@/components/Button"
import { X } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/Dialog"
import { useAvailability } from "@/hooks/useAvailability"
import { useBooking } from "@/hooks/useBooking"
import { useHoliday } from "@/hooks/useHoliday"
import { Card, CardContent } from "@/components/Card"

interface AvailabilityCalendarProps {
  view: "timeGridDay" | "timeGridWeek"
  onViewChange: (view: "timeGridDay" | "timeGridWeek") => void
  selectedEngineer: string
  date: Date
}

interface Availability {
  id: string
  day: string
  start: Date | string
  end: Date | string
  userId: string
}

interface Holiday {
  id: string
  start: Date | string
  end: Date | string
  userId: string
}

export const AvailabilityCalendar = forwardRef<any, AvailabilityCalendarProps>(
  ({ view, onViewChange, selectedEngineer, date }, ref) => {
    const calendarRef = useRef<any>(null)
    const [isEditMode, setIsEditMode] = useState(false)
    const [availabilities, setAvailabilities] = useState<Availability[]>([])
    const [holidays, setHolidays] = useState<Holiday[]>([])
    const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date; day: string } | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [existingAvailability, setExistingAvailability] = useState<Availability | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [bookings, setBookings] = useState([])
    const [visibleRange, setVisibleRange] = useState<{ start: Date; end: Date } | null>(null)

    const { getEngineerAvailability, createAvailability, updateAvailability, deleteAvailability } = useAvailability()
    const { getEngineerBookings } = useBooking()
    const { getUserHolidays } = useHoliday()

    useImperativeHandle(ref, () => ({
      getApi: () => calendarRef.current?.getApi(),
    }))

    // Fetch availabilities when engineer or date changes
    useEffect(() => {
      if (selectedEngineer) {
        fetchAvailabilities()
        fetchEngineersBooking()
        fetchEngineerHolidays()
      }
    }, [selectedEngineer, date])

    const fetchAvailabilities = async () => {
      setIsLoading(true)
      try {
        const data = await getEngineerAvailability(selectedEngineer, date)
        //@ts-ignore
        setAvailabilities(data)
        console.log("Disponibilità ricevute:", data)
      } catch (error) {
        console.error("Error fetching availabilities:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchEngineersBooking = async () => {
      setIsLoading(true)
      try {
        const data = await getEngineerBookings(selectedEngineer)
        setBookings(data)
        console.log("Prenotazioni ricevute:", data)
      } catch (error) {
        console.error("Error fetching bookings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchEngineerHolidays = async () => {
      setIsLoading(true)
      try {
        const data = await getUserHolidays(selectedEngineer)
        if (data) {
          setHolidays(data)
          console.log("Ferie ricevute:", data)
        }
      } catch (error) {
        console.error("Error fetching holidays:", error)
      } finally {
        setIsLoading(false)
      }
    }

    useEffect(() => {
      if (calendarRef.current) {
        const api = calendarRef.current.getApi()
        queueMicrotask(() => {
          api.changeView(view)
          // Aggiorna il range visibile quando cambia la vista
          setVisibleRange({
            start: api.view.activeStart,
            end: api.view.activeEnd,
          })
        })
      }
    }, [view])

    const getEventColor = (type: string) => {
      switch (type) {
        case "availability":
          return { backgroundColor: "#4ade80", borderColor: "#22c55e" }
        case "booking":
          return { backgroundColor: "#FF5B00", borderColor: "#FF5B00" }
        case "holiday":
          return { backgroundColor: "#6366f1", borderColor: "#4f46e5" } // Indigo color for holidays
        default:
          return { backgroundColor: "#4ade80", borderColor: "#22c55e" }
      }
    }

    const normalizeDate = (date: Date): Date => {
      // Create a new date object to avoid mutation
      const normalized = new Date(date)
      // Ensure consistent timezone handling
      return normalized
    }

    const getDayFromDate = (date: Date): string => {
      const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]

      // Get the hour in local time
      const hour = date.getHours()

      // Log the exact date and time for debugging
      console.log(`Date: ${date.toISOString()}, Local hour: ${hour}, Day: ${date.getDay()}`)

      if (hour >= 0 && hour <= 4) {
        // Create a new date subtracting one day
        const prevDate = new Date(date)
        prevDate.setDate(date.getDate() - 1)
        console.log(`Adjusted to previous day: ${prevDate.toISOString()}, Day: ${prevDate.getDay()}`)
        return days[prevDate.getDay()]
      }

      return days[date.getDay()]
    }

    const handleDateSelect = useCallback(
      (selectInfo: any) => {
        if (!isEditMode) return

        const roundToNearestHalfHour = (date: Date) => {
          const minutes = date.getMinutes()
          const roundedMinutes = Math.round(minutes / 30) * 30
          return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), roundedMinutes)
        }

        const start = roundToNearestHalfHour(selectInfo.start)
        const end = roundToNearestHalfHour(selectInfo.end)

        // IMPORTANTE: Usa il giorno della colonna del calendario, non il giorno effettivo della data
        // Questo garantisce che anche le disponibilità dopo mezzanotte mantengano il giorno corretto
        // Il giorno deve essere quello della colonna del calendario, non quello della data effettiva
        // Questo è fondamentale per mantenere la coerenza con la visualizzazione del calendario
        const day = getDayFromDate(selectInfo.start)
        console.log(day)
        console.log("Giorno selezionato:", day)
        console.log("Dettagli selezione:", selectInfo)

        // Check if there's an existing availability for this slot
        const existing = availabilities.find(
          (a) =>
            a.userId === selectedEngineer &&
            a.day === day &&
            new Date(a.start).getHours() === start.getHours() &&
            new Date(a.start).getMinutes() === start.getMinutes() &&
            new Date(a.end).getHours() === end.getHours() &&
            new Date(a.end).getMinutes() === end.getMinutes(),
        )

        setSelectedSlot({ start, end, day })
        setExistingAvailability(existing || null)
        setIsDialogOpen(true)
      },
      [isEditMode, availabilities, selectedEngineer],
    )

    const handleAddAvailability = async () => {
      if (!selectedSlot) return

      setIsLoading(true)
      try {
        if (existingAvailability) {
          await handleRemoveAvailability()
          return
        }

        // IMPORTANTE: Usa il giorno selezionato senza modificarlo, anche se l'orario attraversa la mezzanotte
        // Create new availability
        await createAvailability({
          day: selectedSlot.day,
          engineerId: selectedEngineer,
          start: format(selectedSlot.start, "HH:mm"),
          end: format(selectedSlot.end, "HH:mm"),
        })

        // Refresh availabilities
        await fetchAvailabilities()

        setIsDialogOpen(false)
        setSelectedSlot(null)
        setExistingAvailability(null)
      } catch (error) {
        console.error("Error adding availability:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const handleRemoveAvailability = async () => {
      if (!existingAvailability) return

      setIsLoading(true)
      try {
        await deleteAvailability(existingAvailability.id)

        // Refresh availabilities
        await fetchAvailabilities()

        setIsDialogOpen(false)
        setSelectedSlot(null)
        setExistingAvailability(null)
      } catch (error) {
        console.error("Error removing availability:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Funzione per generare eventi per tutte le settimane visibili
    const generateRecurringEvents = useCallback(() => {
      if (!visibleRange || !availabilities.length) return []

      const events = []

      // Ottieni la data di inizio e fine del range visibile
      const rangeStart = new Date(visibleRange.start)
      const rangeEnd = new Date(visibleRange.end)

      console.log(`Range visible: ${rangeStart.toISOString()} - ${rangeEnd.toISOString()}`)

      // Calcola il numero di settimane nel range visibile
      const msPerWeek = 7 * 24 * 60 * 60 * 1000
      const weeksInRange = Math.ceil((rangeEnd.getTime() - rangeStart.getTime()) / msPerWeek)

      // Per ogni settimana nel range visibile
      for (let weekOffset = 0; weekOffset < weeksInRange; weekOffset++) {
        // Calcola la data di inizio della settimana corrente
        const weekStart = new Date(rangeStart)
        weekStart.setDate(rangeStart.getDate() + weekOffset * 7)
        weekStart.setHours(0, 0, 0, 0)

        // Per ogni disponibilità
        for (const availability of availabilities) {
          // Converti il giorno della settimana in numero (0 = domenica, 1 = lunedì, ecc.)
          const days = { sun: 6, mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5 }
          const dayNumber = days[availability.day.toLowerCase() as keyof typeof days]

          if (dayNumber === undefined) {
            console.error(`Giorno non valido: ${availability.day}`)
            continue
          }

          // Calcola la data per questo giorno della settimana
          const eventDate = new Date(weekStart)
          eventDate.setDate(weekStart.getDate() + dayNumber)

          // Parse the hours and minutes
          const startTime =
            typeof availability.start === "string" ? availability.start : format(availability.start, "HH:mm")
          const endTime = typeof availability.end === "string" ? availability.end : format(availability.end, "HH:mm")

          const startParts = startTime.split(":")
          const endParts = endTime.split(":")

          // Crea le date di inizio e fine dell'evento
          const startDate = normalizeDate(new Date(eventDate))
          startDate.setHours(Number.parseInt(startParts[0]), Number.parseInt(startParts[1]), 0)

          const endDate = normalizeDate(new Date(eventDate))
          endDate.setHours(Number.parseInt(endParts[0]), Number.parseInt(endParts[1]), 0)

          // Gestisci correttamente gli orari dopo mezzanotte
          // Se l'orario di fine è prima dell'orario di inizio, significa che attraversa la mezzanotte
          // In questo caso, aggiungiamo un giorno alla data di fine, ma manteniamo il giorno originale per la visualizzazione
          if (
            Number.parseInt(endParts[0]) < Number.parseInt(startParts[0]) ||
            (Number.parseInt(endParts[0]) === 0 && Number.parseInt(startParts[0]) > 0)
          ) {
            endDate.setDate(endDate.getDate() + 1) // Aggiungi un giorno se l'orario di fine è prima dell'orario di inizio
          }

          // Se l'orario di inizio è dopo mezzanotte ma prima delle 4 del mattino,
          // dobbiamo spostare l'evento al giorno precedente per la visualizzazione
          if (Number.parseInt(startParts[0]) >= 0 && Number.parseInt(startParts[0]) < 4) {
            startDate.setDate(startDate.getDate() + 1)
            endDate.setDate(endDate.getDate() + 1)
          }

          // Verifica se l'evento è all'interno del range visibile
          if (startDate <= rangeEnd && endDate >= rangeStart) {
            // Crea l'evento con la data corretta
            events.push({
              id: `${availability.id}-${weekOffset}`,
              title: "Disponibile",
              start: startDate,
              end: endDate,
              userId: availability.userId,
              day: availability.day,
              type: "availability",
              extendedProps: {
                originalId: availability.id,
                day: availability.day,
              },
            })
          }
        }
      }

      return events
    }, [availabilities, visibleRange])

    // Genera gli eventi delle ferie
    const generateHolidayEvents = useCallback(() => {
      if (!holidays.length) return []

      return holidays.map((holiday) => {
        const startDate = new Date(holiday.start)
        const endDate = new Date(holiday.end)
        
        return {
          id: `holiday-${holiday.id}`,
          title: "Ferie",
          start: startDate,
          end: endDate,
          userId: holiday.userId,
          type: "holiday",
          allDay: false,
        }
      })
    }, [holidays])

    // Genera gli eventi da visualizzare
    const eventsToDisplay = useCallback(() => {
      const availabilityEvents = generateRecurringEvents()
      const holidayEvents = generateHolidayEvents()

      // Aggiungi le prenotazioni e le ferie
      const allEvents = [
        ...availabilityEvents,
        ...holidayEvents,
        ...bookings.map((b) => {
          return {
            //@ts-ignore
            id: b.id,
            //@ts-ignore
            title: b.user?.username || "Prenotazione",
            //@ts-ignore
            start: b.start,
            //@ts-ignore
            end: b.end,
            type: "booking",
          }
        }),
      ]

      // Filtra gli eventi in base alla modalità di modifica
      return allEvents.filter((ev) => {
        if (isEditMode) {
          // In modalità modifica, mostra solo disponibilità e ferie
          return ev.type === "availability"
        }
        // In modalità visualizzazione, mostra tutto
        return true
      })
    }, [generateRecurringEvents, generateHolidayEvents, bookings, isEditMode])

    const handleDeleteEvent = async (eventId: string) => {
      // Estrai l'ID originale dalla stringa (rimuovi il suffisso -weekOffset)
      const originalId = eventId.split("-")[0]

      setIsLoading(true)
      try {
        await deleteAvailability(originalId)
        // Refresh availabilities
        await fetchAvailabilities()
      } catch (error) {
        console.error("Error deleting availability:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const handleSaveChanges = async () => {
      setIsEditMode(false)
      await fetchAvailabilities()
    }

    // Calcola le ore totali
    const calculateTotalHours = (events: any[]) => {
      return events.reduce((total, event) => {
        const start = new Date(event.start)
        const end = new Date(event.end)
        const durationInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
        return total + durationInHours
      }, 0)
    }

    const getTotalAvailabilityHours = () => {
      const availabilityEvents = eventsToDisplay().filter((event) => event.type === "availability")
      return calculateTotalHours(availabilityEvents)
    }

    const getTotalBookingHours = () => {
      // Ottieni l'intervallo di date attualmente visualizzato nel calendario
      if (!calendarRef.current) return 0

      const api = calendarRef.current.getApi()
      const viewStart = api.view.activeStart
      const viewEnd = api.view.activeEnd

      // Filtra solo le prenotazioni che rientrano nell'intervallo di date visualizzato
      const bookingEvents = eventsToDisplay().filter((event) => {
        const eventStart = new Date(event.start)
        return event.type === "booking" && eventStart >= viewStart && eventStart < viewEnd
      })

      return calculateTotalHours(bookingEvents)
    }

    const getTotalHolidayHours = () => {
      // Ottieni l'intervallo di date attualmente visualizzato nel calendario
      if (!calendarRef.current) return 0

      const api = calendarRef.current.getApi()
      const viewStart = api.view.activeStart
      const viewEnd = api.view.activeEnd

      // Filtra solo le ferie che rientrano nell'intervallo di date visualizzato
      const holidayEvents = eventsToDisplay().filter((event) => {
        const eventStart = new Date(event.start)
        return event.type === "holiday" && eventStart >= viewStart && eventStart < viewEnd
      })

      return calculateTotalHours(holidayEvents)
    }

    // Aggiorna il range visibile quando cambia la vista del calendario
    const handleDatesSet = useCallback((info: any) => {
      setVisibleRange({
        start: info.view.activeStart,
        end: info.view.activeEnd,
      })
    }, [])

    return (
      <div className="overflow-y-scroll">
        <div className="">
          <div className="h-fit">
            {/* Edit mode overlay button */}
            <div className="right-4 top-4 z-10 py-4">
              <Button
                variant={isEditMode ? "default" : "outline"}
                onClick={isEditMode ? handleSaveChanges : () => setIsEditMode(true)}
                className={isEditMode ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                disabled={isLoading}
              >
                {isEditMode ? "Salva modifiche" : "Modifica disponibilità"}
              </Button>
            </div>
            <div className="overflow-x-auto">
              <div className="w-full min-w-[800px]">
                <div className="min-h-[600px] overflow-y-hidden">
                  <FullCalendar
                    ref={calendarRef}
                    plugins={[timeGridPlugin, interactionPlugin]}
                    initialView={view}
                    locale={itLocale}
                    headerToolbar={false}
                    allDaySlot={false}
                    slotMinTime="10:00:00"
                    slotMaxTime="28:00:00"
                    slotDuration="01:00:00"
                    slotLabelInterval="01:00:00"
                    selectable={isEditMode}
                    selectMirror={true}
                    events={eventsToDisplay().map((event) => ({
                      ...event,
                      ...getEventColor(event.type),
                    }))}
                    eventContent={(eventInfo) => (
                      <div className="h-full w-full p-1">
                        {isEditMode && eventInfo.event.extendedProps.originalId && (
                          <button
                            className="right-1 top-1 rounded-full bg-white/20 p-0.5 text-white hover:bg-white/40"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteEvent(eventInfo.event.id)
                            }}
                            disabled={isLoading}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                        <div className="text-xs font-medium text-white">{eventInfo.event.title}</div>
                        <div className="mt-1 text-xs text-white/90">
                          {format(eventInfo.event.start!, "HH:mm")} - {format(eventInfo.event.end!, "HH:mm")}
                        </div>
                      </div>
                    )}
                    select={handleDateSelect}
                    selectConstraint={{
                      startTime: "10:00:00",
                      endTime: "28:00:00",
                    }}
                    slotLabelFormat={{
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }}
                    dayHeaderFormat={{ weekday: "short", day: "2-digit", month: "2-digit" }}
                    height="100%"
                    editable={isEditMode}
                    eventStartEditable={false}
                    eventDurationEditable={isEditMode}
                    datesSet={handleDatesSet}
                    eventResize={
                      isEditMode
                        ? (info) => {
                            // Update the availability duration when resized
                            // Estrai l'ID originale dalla stringa (rimuovi il suffisso -weekOffset)
                            const originalId = info.event.extendedProps.originalId
                            const eventDay = info.event.extendedProps.day

                            updateAvailability(originalId, {
                              day: eventDay,
                              start: format(info.event.start!, "HH:mm"),
                              end: format(info.event.end!, "HH:mm"),
                              engineerId: selectedEngineer,
                            })
                              .then(() => {
                                fetchAvailabilities()
                              })
                              .catch((error: any) => {
                                console.error("Error updating availability:", error)
                                info.revert()
                              })
                          }
                        : undefined
                    }
                  />
                </div>
              </div>
            </div>

            <div className="mt-24 pb-12 right-4 top-4 z-10 pb-24">
              <h2 className="mb-4 text-xl font-semibold">Panoramica</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-1">
                      <p className="text-sm text-emerald-500">Disponibilità</p>
                      <p className="text-2xl font-semibold">{getTotalAvailabilityHours().toFixed(1)} ore</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-1">
                      <p className="text-sm text-primary">Totale sessioni</p>
                      <p className="text-2xl font-semibold">{getTotalBookingHours().toFixed(1)} ore</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-1">
                      <p className="text-sm text-indigo-500">Ferie</p>
                      <p className="text-2xl font-semibold">{getTotalHolidayHours().toFixed(1)} ore</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Gestisci disponibilità</DialogTitle>
                <DialogDescription>
                  {selectedSlot && (
                    <span>
                      Fascia oraria: {format(selectedSlot.start, "HH:mm")} - {format(selectedSlot.end, "HH:mm")}
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                {existingAvailability ? (
                  <Button variant="destructive" onClick={handleRemoveAvailability} disabled={isLoading}>
                    Rimuovi disponibilità
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    className="bg-emerald-500 hover:bg-emerald-600"
                    onClick={handleAddAvailability}
                    disabled={isLoading}
                  >
                    Imposta come disponibile
                  </Button>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                  Annulla
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    )
  },
)

AvailabilityCalendar.displayName = "AvailabilityCalendar"
