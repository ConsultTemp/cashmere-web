"use client"

import { forwardRef, useRef, useState, useImperativeHandle, useEffect, useCallback } from "react"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import itLocale from "@fullcalendar/core/locales/it"
import { format, isWithinInterval, startOfWeek, endOfWeek } from "date-fns"
import { it } from "date-fns/locale"
import { Button } from "@/components/Button"
import { X, CalendarIcon, Filter } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/Dialog"
import { useAvailability } from "@/hooks/useAvailability"
import { useBooking } from "@/hooks/useBooking"
import { useHoliday } from "@/hooks/useHoliday"
import { Card, CardContent } from "@/components/Card"
import { useUserStore } from "@/store/user-store"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover"
import { Calendar } from "@/components/Calendar"
import { cn } from "@/lib/utils"

interface AvailabilityCalendarProps {
  view: "timeGridDay" | "timeGridWeek"
  onViewChange: (view: "timeGridDay" | "timeGridWeek") => void
  selectedEngineer: string
  date: Date
  engineerName: string
  isEditMode: boolean
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

interface DateRange {
  from: Date
  to: Date
}

export const AvailabilityCalendar = forwardRef<any, AvailabilityCalendarProps>(
  ({ view, onViewChange, selectedEngineer, engineerName, date, isEditMode }, ref) => {
    const calendarRef = useRef<any>(null)

    const [availabilities, setAvailabilities] = useState<Availability[]>([])
    const [holidays, setHolidays] = useState<Holiday[]>([])
    const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date; day: string } | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [existingAvailability, setExistingAvailability] = useState<Availability | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [bookings, setBookings] = useState([])
    const [visibleRange, setVisibleRange] = useState<{ start: Date; end: Date } | null>(null)

    // Aggiungi stato per il range di date personalizzato
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: startOfWeek(new Date(), { weekStartsOn: 1 }),
      to: endOfWeek(new Date(), { weekStartsOn: 1 }),
    })
    const [isCustomRange, setIsCustomRange] = useState(false)

    const { getEngineerAvailability, createAvailability, updateAvailability, deleteAvailability } = useAvailability()
    const { getEngineerBookings } = useBooking()
    const { getUserHolidays } = useHoliday()
    const { user } = useUserStore()

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
        console.log("fonico selezionato: ", selectedEngineer)
        console.log(selectedEngineer)
        const data = await getEngineerBookings(selectedEngineer)
        console.log(data)
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
      //@ts-ignore
      return holidays
      //@ts-ignore
        .filter((h) => h.state == "CONFERMATO")
        .map((holiday) => {
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
      console.log("vacanze")
      console.log(holidayEvents)
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

    // Modifica le funzioni di calcolo per utilizzare il range di date personalizzato
    const getTotalAvailabilityHours = () => {
      const availabilityEvents = eventsToDisplay().filter((event) => {
        if (!isCustomRange || !dateRange) {
          // Se non è selezionato un range personalizzato, usa la vista corrente del calendario
          if (!calendarRef.current) return false
          const api = calendarRef.current.getApi()
          const viewStart = api.view.activeStart
          const viewEnd = api.view.activeEnd
          const eventStart = new Date(event.start)
          return event.type === "availability" && eventStart >= viewStart && eventStart < viewEnd
        }

        // Altrimenti, filtra in base al range personalizzato
        const eventStart = new Date(event.start)
        return (
          event.type === "availability" && isWithinInterval(eventStart, { start: dateRange.from, end: dateRange.to })
        )
      })

      return calculateTotalHours(availabilityEvents)
    }

    const getTotalBookingHours = () => {
      const bookingEvents = eventsToDisplay().filter((event) => {
        if (!isCustomRange || !dateRange) {
          // Se non è selezionato un range personalizzato, usa la vista corrente del calendario
          if (!calendarRef.current) return false
          const api = calendarRef.current.getApi()
          const viewStart = api.view.activeStart
          const viewEnd = api.view.activeEnd
          const eventStart = new Date(event.start)
          return event.type === "booking" && eventStart >= viewStart && eventStart < viewEnd
        }

        // Altrimenti, filtra in base al range personalizzato
        const eventStart = new Date(event.start)
        return event.type === "booking" && isWithinInterval(eventStart, { start: dateRange.from, end: dateRange.to })
      })

      return calculateTotalHours(bookingEvents)
    }

    const getTotalHolidayHours = () => {
      const holidayEvents = eventsToDisplay().filter((event) => {
        if (!isCustomRange || !dateRange) {
          // Se non è selezionato un range personalizzato, usa la vista corrente del calendario
          if (!calendarRef.current) return false
          const api = calendarRef.current.getApi()
          const viewStart = api.view.activeStart
          const viewEnd = api.view.activeEnd
          const eventStart = new Date(event.start)
          return event.type === "holiday" && eventStart >= viewStart && eventStart < viewEnd
        }

        // Altrimenti, filtra in base al range personalizzato
        const eventStart = new Date(event.start)
        return event.type === "holiday" && isWithinInterval(eventStart, { start: dateRange.from, end: dateRange.to })
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

    // Funzione per formattare l'intervallo di date
    const formatDateRange = (range: DateRange | undefined) => {
      if (!range || !range.from) return "Settimana corrente"

      if (!range.to) {
        return format(range.from, "d MMMM yyyy", { locale: it })
      }

      if (range.from.getMonth() === range.to.getMonth()) {
        return `${format(range.from, "d", { locale: it })} - ${format(range.to, "d MMMM yyyy", { locale: it })}`
      }

      return `${format(range.from, "d MMM", { locale: it })} - ${format(range.to, "d MMM yyyy", { locale: it })}`
    }

    // Funzione per resettare alla settimana corrente
    const resetToCurrentWeek = () => {
      setDateRange({
        from: startOfWeek(new Date(), { weekStartsOn: 1 }),
        to: endOfWeek(new Date(), { weekStartsOn: 1 }),
      })
      setIsCustomRange(false)
    }

    return (
      <div className="overflow-y-scroll">
        <div className="">
          <div className="h-fit">
            <div className="overflow-x-auto">
              <div className="w-full min-w-[800px]">
                <div className="min-h-[600px] overflow-y-hidden">
                  <FullCalendar
                    ref={calendarRef}
                    eventDurationEditable={false}
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
                      <div className="h-full w-full p-1 overflow-hidden">
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Panoramica {engineerName}</h2>

                {/* Aggiungi il selettore di intervallo di date */}
                <div className="flex items-center gap-2">
                  {isCustomRange && (
                    <Button variant="outline" size="sm" onClick={resetToCurrentWeek}>
                      Settimana corrente
                    </Button>
                  )}


                  <div
                    className="pointer-events-auto relative z-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Click intercepted and passed through");
                    }}
                  >
                   
                    <Popover>
                <PopoverTrigger>
                  <Button variant="outline" size="icon" className="bg-gray-100 px-2 py-2 border-0 w-full">
                    <Filter/>Filtra per data
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  {/* @ts-ignore */}
                  <Calendar
                      initialFocus
                      mode="range"
                      selected={dateRange}
                      onSelect={(range) => {
                        console.log("Calendar selection attempted", range);
                        //@ts-ignore
                        setDateRange(range);
                          setIsCustomRange(true);
                      }}
                    />
                </PopoverContent>
              </Popover>
                  </div>
                </div>
              </div>

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
                      <p className="text-sm text-red-500">Ferie</p>
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
