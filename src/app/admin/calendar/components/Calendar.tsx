"use client"

import { forwardRef, useRef, useState, useCallback, useEffect, useImperativeHandle } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import itLocale from "@fullcalendar/core/locales/it"
import type { Booking, CalendarEvent } from "../types/booking"
import { useBooking } from "@/hooks/useBooking"
import { BookingInfoTooltip } from "./BookingInfoTooltip"
import { BookingDialog } from "./BookingDialog"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/Dialog"
import { Button } from "@/components/Button"

interface BookingCalendarProps {
  view: "timeGridDay" | "timeGridWeek" | "dayGridMonth"
  selectedStudio: string
  selectedFonico: string
  canEdit: boolean
}

export const BookingCalendar = forwardRef<any, BookingCalendarProps>(
  ({ view, selectedStudio, selectedFonico, canEdit }, ref) => {
    const calendarRef = useRef<any>(null)
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
    const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
    const [bookings, setBookings] = useState<CalendarEvent[]>([])
    const [tooltipEvent, setTooltipEvent] = useState<CalendarEvent | null>(null)
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
    const [overlappingBookings, setOverlappingBookings] = useState<Set<string>>(new Set())

    // Stato per il modale di conferma
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
    const [modifiedEvent, setModifiedEvent] = useState<any>(null)
    const [modificationInfo, setModificationInfo] = useState<{
      start: string
      end: string
      type: "resize" | "drop"
      originalEvent: any
    } | null>(null)

    const { getAll, createBooking, updateBooking, deleteBooking } = useBooking()

    // Mappa dei colori per gli studi
    const studioColors: Record<string, string> = {
      z7wqktx3y0m24vn9slcbdg5rp: "#3b82f6", // Blu
      fj2m48xyn0vrkzqwtlcsd96bp: "#eab308", // Giallo
      a9xgk7yq34mnp0z2vwsdl5btc: "#f97316", // Arancione
      m3v9xtkq2wsn74yl0cbdg5prz: "#22c55e", // Verde
    }

    // Funzione per trovare prenotazioni sovrapposte
    const findOverlappingBookings = (bookingsList: CalendarEvent[]) => {
      const overlappingIds = new Set<string>()

      // Raggruppa le prenotazioni per studio
      const bookingsByStudio: Record<string, CalendarEvent[]> = {}

      bookingsList.forEach((booking) => {
        if (booking.studioId) {
          if (!bookingsByStudio[booking.studioId]) {
            bookingsByStudio[booking.studioId] = []
          }
          bookingsByStudio[booking.studioId].push(booking)
        }
      })

      // Per ogni studio, controlla le sovrapposizioni
      Object.values(bookingsByStudio).forEach((studioBookings) => {
        for (let i = 0; i < studioBookings.length; i++) {
          const bookingA = studioBookings[i]
          const startA = new Date(bookingA.start)
          const endA = new Date(bookingA.end)

          for (let j = i + 1; j < studioBookings.length; j++) {
            const bookingB = studioBookings[j]
            const startB = new Date(bookingB.start)
            const endB = new Date(bookingB.end)

            // Verifica sovrapposizione
            if ((startA < endB && endA > startB) || (startB < endA && endB > startA)) {
              if (bookingA.id) overlappingIds.add(bookingA.id)
              if (bookingB.id) overlappingIds.add(bookingB.id)
            }
          }
        }
      })

      setOverlappingBookings(overlappingIds)
    }

    // Chiamata iniziale per ottenere le prenotazioni
    useEffect(() => {
      const fetchBookings = async () => {
        const data = await getAll()
        setBookings(data)
        console.log("Prenotazioni caricate:", data)
        // Esegui immediatamente il controllo delle sovrapposizioni
        findOverlappingBookings(data)
      }

      // Effettua il fetch solo una volta
      if (bookings.length === 0) {
        fetchBookings()
      }
    }, [])

    const refresh = async () => {
      const data = await getAll()
      setBookings(data)
      // Ricalcola le sovrapposizioni dopo ogni aggiornamento
      findOverlappingBookings(data)
    }

    useImperativeHandle(ref, () => ({
      getApi: () => calendarRef.current?.getApi(),
    }))

    // Aggiorna la vista quando cambia la view
    useEffect(() => {
      const api = calendarRef.current?.getApi()
      if (api && api.view.type !== view) {
        setTimeout(() => {
          api.changeView(view)
        }, 0)
      }
    }, [view])

    // Gestione mouse hover per il tooltip
    const handleEventMouseEnter = useCallback((mouseEnterInfo: any) => {
      const event = mouseEnterInfo.event.extendedProps as CalendarEvent
      // Aggiungi start e end direttamente se non sono già inclusi
      const eventWithTimes = {
        ...event,
        start: mouseEnterInfo.event.startStr,
        end: mouseEnterInfo.event.endStr,
      }

      setTooltipEvent(eventWithTimes) // Passa l'oggetto completo al tooltip

      // Posizione del tooltip (vicino al mouse)
      const rect = mouseEnterInfo.el.getBoundingClientRect()
      setTooltipPosition({
        x: rect.left + rect.width, // Posiziona il tooltip a destra dell'evento
        y: rect.top,
      })
    }, [])

    const handleEventMouseLeave = useCallback(() => {
      setTooltipEvent(null) // Nascondi il tooltip quando esci dall'evento
    }, [])

    // Filtra gli eventi in base alla selezione
    const filteredEvents = bookings.filter((booking) => {
      if (selectedStudio !== "all" && booking.studioId !== selectedStudio) {
        return false
      }
      

      return true
    })

    // Gestisce il click sugli eventi
    const handleEventClick = useCallback((info: any) => {
      console.log("Evento cliccato:", info.event) // Debug completo

      const eventId = info.event.id || info.event._def.publicId || info.event._def.extendedProps?.id

      // Creazione dell'oggetto evento con start, end e id
      const selectedEventWithTimes: CalendarEvent = {
        ...info.event._def.extendedProps, // Mantiene gli altri dati dell'evento
        id: eventId, // Assegna l'ID corretto
        start: info.event.start ? info.event.start.toISOString() : "",
        end: info.event.end ? info.event.end.toISOString() : "",
      }

      console.log("Evento selezionato con ID e orari:", selectedEventWithTimes)

      setSelectedEvent(selectedEventWithTimes) // Imposta l'evento selezionato con ID
      setIsBookingDialogOpen(true) // Apre il dialogo di prenotazione
    }, [])

    // Funzione per correggere le date che attraversano la mezzanotte
    const fixOvernightDates = (start: Date, end: Date): { start: Date; end: Date } => {
      // Caso speciale: se sia l'inizio che la fine sono dopo mezzanotte ma prima delle 4
      if (start.getHours() >= 0 && start.getHours() < 4 && end.getHours() >= 0 && end.getHours() < 4) {
        console.log("Prenotazione notturna rilevata (00-04): mantengo la data originale")

        // Se la data di fine è un giorno dopo l'inizio, ma entrambi sono dopo mezzanotte
        // Correggiamo impostando la fine allo stesso giorno dell'inizio
        if (end.getDate() > start.getDate()) {
          const correctedEnd = new Date(end)
          correctedEnd.setDate(start.getDate())
          console.log("Data fine corretta allo stesso giorno:", correctedEnd)
          return { start, end: correctedEnd }
        }

        return { start, end }
      }

      // Se l'ora di fine è prima dell'ora di inizio, significa che l'evento attraversa la mezzanotte
      if (end.getHours() < start.getHours()) {
        console.log("Evento che attraversa la mezzanotte rilevato")
        console.log("Start originale:", start)
        console.log("End originale:", end)

        // Se la data di fine è già il giorno successivo, non fare nulla
        if (end.getDate() === start.getDate() + 1) {
          return { start, end }
        }

        // Se la data di fine è due o più giorni dopo, correggi
        if (end.getDate() > start.getDate() + 1) {
          // Imposta la data di fine al giorno successivo rispetto all'inizio
          const correctedEnd = new Date(start)
          correctedEnd.setDate(start.getDate() + 1)
          correctedEnd.setHours(end.getHours())
          correctedEnd.setMinutes(end.getMinutes())
          correctedEnd.setSeconds(end.getSeconds())

          console.log("End corretto:", correctedEnd)
          return { start, end: correctedEnd }
        }
      }

      return { start, end }
    }

    // Gestisce il ridimensionamento di un evento
    const handleEventResize = useCallback((info: any) => {
      // Ottieni l'ID dell'evento
      const eventId = info.event.id || info.event._def.publicId || info.event._def.extendedProps.id

      // Crea un oggetto completo con tutti i dati dell'evento
      const updatedEvent = {
        ...info.event._def.extendedProps,
        id: eventId, // Assicurati che l'ID sia incluso
        start: info.event.start.toISOString(),
        end: info.event.end.toISOString(),
        title: info.event.title,
      }

      console.log("Prenotazione ridimensionata - Prenotazione completa:", updatedEvent)

      // Memorizza le informazioni sulla modifica e apre il modale di conferma
      setModificationInfo({
        start: format(new Date(updatedEvent.start), "dd/MM/yyyy HH:mm"),
        end: format(new Date(updatedEvent.end), "dd/MM/yyyy HH:mm"),
        type: "resize",
        originalEvent: info,
      })
      setModifiedEvent(updatedEvent)
      setIsConfirmDialogOpen(true)

      // Annulla temporaneamente la modifica fino alla conferma
      info.revert()
    }, [])

    // Gestisce lo spostamento di un evento
    const handleEventDrop = useCallback((info: any) => {
      // Ottieni l'ID dell'evento
      const eventId = info.event.id || info.event._def.publicId || info.event._def.extendedProps.id

      // Crea un oggetto completo con tutti i dati dell'evento
      const updatedEvent = {
        ...info.event._def.extendedProps,
        id: eventId, // Assicurati che l'ID sia incluso
        start: info.event.start.toISOString(),
        end: info.event.end.toISOString(),
        title: info.event.title,
      }

      console.log("Prenotazione spostata - Prenotazione completa:", updatedEvent)

      // Memorizza le informazioni sulla modifica e apre il modale di conferma
      setModificationInfo({
        start: format(new Date(updatedEvent.start), "dd/MM/yyyy HH:mm"),
        end: format(new Date(updatedEvent.end), "dd/MM/yyyy HH:mm"),
        type: "drop",
        originalEvent: info,
      })
      setModifiedEvent(updatedEvent)
      setIsConfirmDialogOpen(true)

      // Annulla temporaneamente la modifica fino alla conferma
      info.revert()
    }, [])

    // Gestisce la conferma della modifica
    const handleConfirmModification = async () => {
      if (!modifiedEvent || !modifiedEvent.id) {
        return
      }

      try {
        console.log("Aggiornamento prenotazione con ID:", modifiedEvent.id)

        // Correggi le date per eventi che attraversano la mezzanotte
        const startDate = new Date(modifiedEvent.start)
        const endDate = new Date(modifiedEvent.end)

        console.log("Date originali - Start:", startDate, "End:", endDate)

        const { start: correctedStart, end: correctedEnd } = fixOvernightDates(startDate, endDate)

        console.log("Date corrette - Start:", correctedStart, "End:", correctedEnd)

        // Chiama la funzione di aggiornamento con le date corrette
        const result = await updateBooking(modifiedEvent.id, {
          start: correctedStart,
          end: correctedEnd,
        })

        if (result) {
          console.log("Prenotazione aggiornata con successo:", result)

          // Aggiorna la vista del calendario
          const api = calendarRef.current?.getApi()
          if (api) {
            // Riapplica la modifica
            if (modificationInfo?.originalEvent) {
              // Aggiorna l'evento nel calendario
              const event = api.getEventById(modifiedEvent.id)
              if (event) {
                event.setStart(correctedStart)
                event.setEnd(correctedEnd)
              }
            }
          }

          // Aggiorna la lista delle prenotazioni
          const updatedBookings = bookings.map((booking) =>
            booking.id === modifiedEvent.id
              ? {
                  ...booking,
                  ...modifiedEvent,
                  start: correctedStart.toISOString(),
                  end: correctedEnd.toISOString(),
                }
              : booking,
          )
          setBookings(updatedBookings)
        }
      } catch (error) {
        console.error("Errore durante l'aggiornamento della prenotazione:", error)
      } finally {
        setIsConfirmDialogOpen(false)
        setModifiedEvent(null)
        setModificationInfo(null)
        setTimeout(() => {
          refresh()
        }, 1000)
      }
    }

    // Gestisce l'annullamento della modifica
    const handleCancelModification = () => {
      setIsConfirmDialogOpen(false)
      setModifiedEvent(null)
      setModificationInfo(null)
    }

    // Gestisce la selezione di una data
    const handleDateSelect = useCallback((info: any) => {
      console.log("Selezione data - Info completa:", info)
      console.log("Start:", info.startStr)
      console.log("End:", info.endStr)

      const start = info.startStr
      const end = info.endStr

      setSelectedEvent({
        start,
        end,
        title: "",
        //@ts-ignore
        description: "dc",
        studioId: "",
        fonicoId: "",
      })

      setIsBookingDialogOpen(true)
    }, [])

    const onDelete = (id: string) => {
      setIsBookingDialogOpen(false)
      deleteBooking(id)
      setTimeout(() => {
        refresh()
      }, 1000)
    }

    const onSubmit = (booking: Booking) => {
      console.log("Prenotazione da salvare (originale):", booking)
      setIsBookingDialogOpen(false)

      try {
        // Correggi le date per eventi che attraversano la mezzanotte
        const startDate = new Date(booking.start)
        const endDate = new Date(booking.end)

        console.log("Date originali - Start:", startDate, "End:", endDate)

        const { start: correctedStart, end: correctedEnd } = fixOvernightDates(startDate, endDate)

        console.log("Date corrette - Start:", correctedStart, "End:", correctedEnd)

        // Salva la prenotazione corretta
        const bookingToSave = {
          ...booking,
          start: correctedStart,
          end: correctedEnd,
        }

        if (booking.id) {
          updateBooking(booking.id, bookingToSave)
        } else {
          createBooking(bookingToSave)
        }
      } catch (error) {
        console.error("Errore durante il salvataggio della prenotazione:", error)
        // Salva comunque la prenotazione originale in caso di errore
        if (booking.id) {
          updateBooking(booking.id, booking)
        } else {
          createBooking(booking)
        }
      }

      setTimeout(() => {
        refresh()
      }, 1000)
    }

    // Render the events with the username if it exists
    const renderEventContent = (event: CalendarEvent) => {
      // Check if the event has a user and display the username
      return (
        <div className="overflow-hidden">
          {/* @ts-ignore */}
          <strong>{event.timeText}</strong>
          {/* @ts-ignore */}
          {event?.event?._def?.extendedProps?.user?.username && (
            <div className="text-xs text-white poppins-medium">{event.event._def.extendedProps.user.username}</div>
          )}
          {/* @ts-ignore */}
          {event?.event?._def?.extendedProps?.fonico?.username && (
            <div className="text-xs text-white poppins-medium">{event.event._def.extendedProps.fonico.username}</div>
          )}
        </div>
      )
    }

    return (
      <>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView={view}
              headerToolbar={false}
              locale={itLocale}
              firstDay={1}
              events={filteredEvents.map((event) => {
                // Determina il colore in base allo studio
                const studioColor =
                  event.studioId && studioColors[event.studioId] ? studioColors[event.studioId] : "#6366f1" // Colore predefinito indaco

                // Verifica se l'evento è sovrapposto
                const isOverlapping = event.id && overlappingBookings.has(event.id)

                return {
                  ...event,
                  backgroundColor: studioColor,
                  borderColor: isOverlapping ? "#ef4444" : studioColor,
                  classNames: isOverlapping ? ['overlapping-event'] : [],
                  nextDayThreshold: "00:00:00",
                }
              })}
              editable={canEdit}
              eventResizableFromStart={canEdit}
              selectable={canEdit}
              selectMirror={true}
              dayMaxEvents={false}
              forceEventDuration={true}
              defaultTimedEventDuration="01:00:00"
              eventClassNames={(event) => {
                if (event.view.type === "dayGridMonth") {
                  return ["bg-blue-500 text-white hover:bg-blue-400"] // Applica la classe blu
                }
                return [] // Nessuna classe per altre viste
              }}
              allDaySlot={false}
              slotMinTime="10:00:00"
              slotMaxTime="28:00:00"
              slotDuration="01:00:00"
              slotLabelInterval="01:00:00"
              slotLabelFormat={{
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
                meridiem: false,
              }}
              scrollTime="10:00:00"
              nowIndicator={true}
              expandRows={true}
              height="auto"
              dayHeaderFormat={{ weekday: "short", day: "numeric" }}
              eventClick={handleEventClick}
              select={handleDateSelect}
              eventMouseEnter={handleEventMouseEnter}
              eventMouseLeave={handleEventMouseLeave}
              eventResize={handleEventResize}
              eventDrop={handleEventDrop}
              timeZone="local"
              eventContent={renderEventContent}
            />
          </div>
        </div>

        {/* Tooltip per l'evento */}
        {tooltipEvent && (
          <BookingInfoTooltip event={tooltipEvent} position={tooltipPosition} onClose={() => setTooltipEvent(null)} />
        )}

        {/* Dialog di prenotazione */}
        <BookingDialog
          isOpen={isBookingDialogOpen}
          onClose={() => {
            console.log("Evento selezionato:", selectedEvent) // Stampa l'evento selezionato quando chiudi il dialogo
            setIsBookingDialogOpen(false)
            setSelectedEvent(null)
          }}
          canEdit={canEdit}
          onDelete={onDelete}
          onSave={onSubmit}
          booking={selectedEvent ? selectedEvent : {}}
        />

        {/* Dialog di conferma modifica */}
        <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Conferma modifica</DialogTitle>
              <DialogDescription>
                Sei sicuro di voler {modificationInfo?.type === "resize" ? "ridimensionare" : "spostare"} la
                prenotazione?
              </DialogDescription>
            </DialogHeader>

            {modificationInfo && (
              <div className="py-4">
                <p className="mb-2">Nuovi orari:</p>
                <p>
                  <strong>Inizio:</strong> {modificationInfo.start}
                </p>
                <p>
                  <strong>Fine:</strong> {modificationInfo.end}
                </p>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={handleCancelModification}>
                Annulla
              </Button>
              <Button onClick={handleConfirmModification}>Conferma</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  },
)

BookingCalendar.displayName = "BookingCalendar"
