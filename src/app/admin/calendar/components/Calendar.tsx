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

export const BookingCalendar = forwardRef<any, BookingCalendarProps>(({ view, selectedStudio, selectedFonico, canEdit }, ref) => {
  const calendarRef = useRef<any>(null)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [bookings, setBookings] = useState<CalendarEvent[]>([])
  const [tooltipEvent, setTooltipEvent] = useState<CalendarEvent | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

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

  // Chiamata iniziale per ottenere le prenotazioni
  useEffect(() => {
    const fetchBookings = async () => {
      const data = await getAll()
      setBookings(data)
      console.log(data)
    }

    // Effettua il fetch solo una volta
    if (bookings.length === 0) {
      fetchBookings()
    }
  }, [])

  const refresh = async () => {
    const data = await getAll()
    setBookings(data)
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
    if (selectedFonico !== "all" && booking.fonicoId !== selectedFonico) {
      return false
    }

    return true
  })

  // Gestisce il click sugli eventi
  const handleEventClick = useCallback((info: any) => {
    console.log("Evento cliccato:", info.event); // Debug completo

    const eventId = info.event.id || info.event._def.publicId || info.event._def.extendedProps?.id;

    // Creazione dell'oggetto evento con start, end e id
    const selectedEventWithTimes: CalendarEvent = {
      ...info.event._def.extendedProps, // Mantiene gli altri dati dell'evento
      id: eventId, // Assegna l'ID corretto
      start: info.event.start ? info.event.start.toISOString() : "",
      end: info.event.end ? info.event.end.toISOString() : "",
    };

    console.log("Evento selezionato con ID e orari:", selectedEventWithTimes);

    setSelectedEvent(selectedEventWithTimes); // Imposta l'evento selezionato con ID
    setIsBookingDialogOpen(true); // Apre il dialogo di prenotazione
  }, []);


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
      //console.error("ID evento mancante:", modifiedEvent)
      return
    }

    try {
      console.log("Aggiornamento prenotazione con ID:", modifiedEvent.id)

      // Chiama la funzione di aggiornamento
      const result = await updateBooking(modifiedEvent.id, {
        start: new Date(modifiedEvent.start),
        end: new Date(modifiedEvent.end),
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
              event.setStart(new Date(modifiedEvent.start))
              event.setEnd(new Date(modifiedEvent.end))
            }
          }
        }

        // Aggiorna la lista delle prenotazioni
        const updatedBookings = bookings.map((booking) =>
          booking.id === modifiedEvent.id ? { ...booking, ...modifiedEvent } : booking,
        )
        setBookings(updatedBookings)
      }
    } catch (error) {
      //console.error("Errore durante l'aggiornamento della prenotazione:", error)
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
    console.log(booking)
    setIsBookingDialogOpen(false)
    if (booking.id) {
      updateBooking(booking.id, booking)
    } else {
      createBooking(booking)
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
        {event?.event?._def?.extendedProps?.user?.username && (<div className="text-xs text-white poppins-medium">{event.event._def.extendedProps.user.username}</div>
        )}
        {/* @ts-ignore */}
        {event?.event?._def?.extendedProps?.fonico?.username && (<div className="text-xs text-white poppins-medium">{event.event._def.extendedProps.fonico.username}</div>
        )}
      </div>
    );
  };

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
            events={filteredEvents}
            editable={canEdit}
            selectable={canEdit}
            selectMirror={true}
            dayMaxEvents={false}
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

