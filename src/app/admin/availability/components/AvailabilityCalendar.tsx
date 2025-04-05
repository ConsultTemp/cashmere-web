"use client"

import { forwardRef, useRef, useState, useImperativeHandle, useEffect, useCallback } from "react"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import itLocale from "@fullcalendar/core/locales/it"
import { format } from "date-fns"
import { Button } from "@/components/Button"
import { X } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/Dialog"
import { useAvailability } from "@/hooks/useAvailability"
import { useBooking } from "@/hooks/useBooking"
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

export const AvailabilityCalendar = forwardRef<any, AvailabilityCalendarProps>(
  ({ view, onViewChange, selectedEngineer, date }, ref) => {
    const calendarRef = useRef<any>(null)
    const [isEditMode, setIsEditMode] = useState(false)
    const [availabilities, setAvailabilities] = useState<Availability[]>([])
    const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date; day: string } | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [existingAvailability, setExistingAvailability] = useState<Availability | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [bookings, setBookings] = useState([])

    const { getEngineerAvailability, createAvailability, updateAvailability, deleteAvailability } = useAvailability()
    const { getEngineerBookings } = useBooking()

    useImperativeHandle(ref, () => ({
      getApi: () => calendarRef.current?.getApi(),
    }))

    // Fetch availabilities when engineer or date changes
    useEffect(() => {
      if (selectedEngineer) {
        fetchAvailabilities()
        fetchEngineersBooking()
      }
    }, [selectedEngineer, date])

    const fetchAvailabilities = async () => {
      setIsLoading(true)
      try {
        const data = await getEngineerAvailability(selectedEngineer, date)
        setAvailabilities(data)
        console.log(data)
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
        console.log(data)
      } catch (error) {
        console.error("Error fetching availabilities:", error)
      } finally {
        setIsLoading(false)
      }
    }

    useEffect(() => {
      if (calendarRef.current) {
        const api = calendarRef.current.getApi()
        queueMicrotask(() => {
          api.changeView(view)
        })
      }
    }, [view])

    const getEventColor = (type: string) => {
      return { backgroundColor: type == "availability" ? "#4ade80" : "#FF5B00", borderColor: "#22c55e" }
    }

    const getDayFromDate = (date: Date): string => {
      const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
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

        // Usa il giorno della data di inizio per la disponibilità
        const day = getDayFromDate(start)

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

    // Convert availabilities to FullCalendar events
    const eventsToDisplay = [
      ...availabilities.map((availability) => {
        // Create a date object for the current view's date but with the availability's time
        const startDate = new Date(date)
        const endDate = new Date(date)

        // Parse the hours and minutes
        const startTime =
          typeof availability.start === "string" ? availability.start : format(availability.start, "HH:mm")

        const endTime = typeof availability.end === "string" ? availability.end : format(availability.end, "HH:mm")

        const startParts = startTime.split(":")
        const endParts = endTime.split(":")

        startDate.setHours(Number.parseInt(startParts[0]), Number.parseInt(startParts[1]), 0)
        endDate.setHours(Number.parseInt(endParts[0]), Number.parseInt(endParts[1]), 0)

        // Gestisci il caso in cui l'orario di fine è prima dell'orario di inizio (attraversa la mezzanotte)
        if (
          Number.parseInt(endParts[0]) < Number.parseInt(startParts[0]) ||
          (Number.parseInt(endParts[0]) === Number.parseInt(startParts[0]) &&
            Number.parseInt(endParts[1]) < Number.parseInt(startParts[1]))
        ) {
          endDate.setDate(endDate.getDate() + 1)
        }

        // Adjust the date based on the day of the week
        const days = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 }
        const dayDiff = days[availability.day as keyof typeof days] - date.getDay()

        startDate.setDate(startDate.getDate() + dayDiff)
        endDate.setDate(endDate.getDate() + (dayDiff + (endDate > startDate ? 0 : 1)))

        return {
          id: availability.id,
          title: "Disponibile",
          start: startDate,
          end: endDate,
          userId: availability.userId,
          day: availability.day,
          type: "availability",
        }
      }),
      ...bookings.map((b) => {
        return {
          //@ts-ignore
          id: b.id,
          //@ts-ignore
          title: b.user.username,
          //@ts-ignore
          start: b.start,
          //@ts-ignore
          end: b.end,
          type: "booking",
        }
      }),
    ].filter((ev) => (isEditMode ? ev.type == "availability" : true))

    const handleDeleteEvent = async (eventId: string) => {
      setIsLoading(true)
      try {
        await deleteAvailability(eventId)

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

    // Aggiungiamo funzioni per calcolare le ore totali
    // Aggiungi queste funzioni dopo la dichiarazione di handleSaveChanges

    // 1. Aggiungi queste funzioni per calcolare le ore:

    const calculateTotalHours = (events: any[]) => {
      return events.reduce((total, event) => {
        const start = new Date(event.start)
        const end = new Date(event.end)
        const durationInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
        return total + durationInHours
      }, 0)
    }

    const getTotalAvailabilityHours = () => {
      const availabilityEvents = eventsToDisplay.filter((event) => event.type === "availability")
      return calculateTotalHours(availabilityEvents)
    }

    const getTotalBookingHours = () => {
      // Ottieni l'intervallo di date attualmente visualizzato nel calendario
      if (!calendarRef.current) return 0

      const api = calendarRef.current.getApi()
      const viewStart = api.view.activeStart
      const viewEnd = api.view.activeEnd

      // Filtra solo le prenotazioni che rientrano nell'intervallo di date visualizzato
      const bookingEvents = eventsToDisplay.filter((event) => {
        const eventStart = new Date(event.start)
        return event.type === "booking" && eventStart >= viewStart && eventStart < viewEnd
      })

      return calculateTotalHours(bookingEvents)
    }

    useEffect(() => {
      if (calendarRef.current) {
        const api = calendarRef.current.getApi()
        const handleDatesSet = () => {
          // Forza un re-render per aggiornare i calcoli delle ore
          setAvailabilities([...availabilities])
        }

        api.on("datesSet", handleDatesSet)

        return () => {
          api.off("datesSet", handleDatesSet)
        }
      }
    }, [calendarRef.current, availabilities])

    return (
      <>
        <div className="h-full">
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

         
            <div className="h-full min-w-[800px]">
              <FullCalendar
                ref={calendarRef}
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView={view}
                locale={itLocale}
                headerToolbar={false}
                allDaySlot={false}
                slotMinTime="10:00:00"
                slotMaxTime="30:00:00"
                slotDuration="01:00:00"
                slotLabelInterval="01:00:00"
                selectable={isEditMode}
                selectMirror={true}
                events={eventsToDisplay.map((availability) => ({
                  ...availability,
                  ...getEventColor(availability.type),
                }))}
                eventContent={(eventInfo) => (
                  <div className="h-full w-full p-1 relative">
                    {isEditMode && (
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
                eventResize={
                  isEditMode
                    ? (info) => {
                        // Update the availability duration when resized
                        const eventId = info.event.id
                        const eventDay = info.event.extendedProps.day
                        const startTime = format(info.event.start!, "HH:mm")
                        const endTime = format(info.event.end!, "HH:mm")

                        // Aggiungi un controllo per verificare se l'evento attraversa la mezzanotte
                        const startHour = Number.parseInt(startTime.split(":")[0])
                        const endHour = Number.parseInt(endTime.split(":")[0])

                        // Gestisci il caso in cui l'evento attraversa la mezzanotte
                        updateAvailability(eventId, {
                          day: eventDay,
                          start: startTime,
                          end: endTime,
                          engineerId: selectedEngineer,
                        })
                          .then(() => {
                            // Aggiungi un breve ritardo prima di ricaricare le disponibilità
                            setTimeout(() => {
                              fetchAvailabilities()
                            }, 300)
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

        <div className="pt-24 pb-12">
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
      </>
    )
  },
)

AvailabilityCalendar.displayName = "AvailabilityCalendar"

