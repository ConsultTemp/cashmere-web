"use client"

import { useEffect, useState } from "react"
import { Calendar, Briefcase, Eye, ArrowUpDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { it } from "date-fns/locale"

import { Button } from "@/components/Button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/Dialog"
import { Calendar as CalendarComponent } from "@/components/Calendar"
import { Textarea } from "@/components/TextArea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select"
import { ScrollArea } from "@/components/ScrollArea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Table"
import { Input } from "@/components/Input"
import { studios, services } from "@/lib/types"
import type { Booking } from "@/types/booking"
import type { BookingState, HolidayTypeType } from "@/types/types"
import { useHoliday } from "@/hooks/useHoliday"
import { useBooking } from "@/hooks/useBooking"
import { useUserStore } from "@/store/user-store"
import { useAvailability } from "@/hooks/useAvailability"

type RequestType = "FERIE" | "PERMESSO" | null

// Tipo per le ferie/permessi
interface Holiday {
  userId: string
  start: Date
  end: Date
  type: HolidayTypeType
  reason: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [requestDialogOpen, setRequestDialogOpen] = useState(false)
  const [bookings, setBookings] = useState([])
  const [availabilities, setAvailabilities] = useState([])
  const [requestType, setRequestType] = useState<RequestType>(null)
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
  const [singleDate, setSingleDate] = useState<Date>()
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [motivazione, setMotivazione] = useState("")

  // Aggiungiamo stati per il modale di visualizzazione
  const [viewSessionDialogOpen, setViewSessionDialogOpen] = useState(false)

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const { createHoliday } = useHoliday()
  const {getEngineerFutureBookings} = useBooking()
  const {getEngineerAvailability} = useAvailability()
  const {user} = useUserStore()
  const handleCalendarClick = () => {
    router.push("/admin/calendar")
  }

  useEffect(() => {
    
    const loadBookings = async () => {
      try {
        const data = await getEngineerFutureBookings(user.id)
        setBookings(data)
        console.log(data)
      } catch (error) {
        console.error("Error loading current bookings:", error)
      }
    }
    loadBookings()
  }, [])

  const handleRequestClick = () => {
    setRequestDialogOpen(true)
  }

  const handleTypeSelect = (type: RequestType) => {
    setRequestType(type)
    // Reset form when changing type
    setDateRange({ from: undefined, to: undefined })
    setSingleDate(undefined)
    setStartTime("")
    setEndTime("")
    setMotivazione("")
  }

  const handleSubmit = () => {
    // Crea l'oggetto Holiday con le date corrette
    const holiday: Holiday = {
      userId: user.id, // Sostituire con l'ID utente corrente
      start: new Date(),
      end: new Date(),
      reason: motivazione,
      type: requestType || "FERIE"
    }

    if (requestType === "FERIE" && dateRange.from && dateRange.to) {
      // Per le ferie: inizio alle 5 del mattino del giorno selezionato
      const startDate = new Date(dateRange.from)
      startDate.setHours(5, 0, 0, 0)

      // Per le ferie: fine alle 5 del mattino del giorno DOPO quello selezionato
      const endDate = new Date(dateRange.to)
      endDate.setDate(endDate.getDate() + 1)
      endDate.setHours(5, 0, 0, 0)

      holiday.start = startDate
      holiday.end = endDate
    } else if (requestType === "PERMESSO" && singleDate && startTime && endTime) {
      // Per i permessi: usa l'orario esatto specificato
      const [startHour, startMinute] = startTime.split(":").map(Number)
      const [endHour, endMinute] = endTime.split(":").map(Number)

      const startDate = new Date(singleDate)
      startDate.setHours(startHour, startMinute, 0, 0)

      const endDate = new Date(singleDate)
      endDate.setHours(endHour, endMinute, 0, 0)

      holiday.start = startDate
      holiday.end = endDate
    }

    console.log("Holiday request:", holiday)
    setRequestDialogOpen(false)
    createHoliday(holiday)
    // Reset form
    setRequestType(null)
    setDateRange({ from: undefined, to: undefined })
    setSingleDate(undefined)
    setStartTime("")
    setEndTime("")
    setMotivazione("")
  }

  const handleViewSession = (booking: Booking) => {
    setSelectedBooking(booking)
    setViewSessionDialogOpen(true)
  }

  // Funzioni helper per ottenere i nomi
  const getStudioName = (studioId: string): string => {
    const studio = studios.find((s) => s.id === studioId)
    return studio ? studio.name : studioId
  }

  const getServiceName = (serviceId: string): string => {
    console.log("serviceid:" + serviceId)
    const service = services.find((s) => s.id === serviceId)
    return service ? service.name : serviceId
  }

  // Generiamo gli orari con intervalli di 15 minuti
  const timeOptions = Array.from({ length: 19 }, (_, i) => {
    const hour = (10 + i) % 24 // Partiamo da 10 e gestiamo il ciclo oltre la mezzanotte
    return `${hour.toString().padStart(2, "0")}:00`
  })

  // Formatta la data per la visualizzazione
  const formatDateRange = () => {
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`
    }
    return "Seleziona date"
  }

  const formatSingleDate = () => {
    if (singleDate) {
      return format(singleDate, "dd/MM/yyyy")
    }
    return "Seleziona data"
  }

  // Formatta data e ora
  const formatDate = (date: Date | string): string => {
    const d = new Date(date)
    return format(d, "EEE, d MMMM", { locale: it })
  }

  const formatTime = (date: Date | string): string => {
    const d = new Date(date)
    return format(d, "HH:mm")
  }

  // Formatta la data di richiesta (per semplicità, uso la data di inizio meno un giorno)
  const formatRequestDate = (date: Date): { day: string; time: string } => {
    const requestDate = new Date(date)
    requestDate.setDate(requestDate.getDate() - 1)

    return {
      day: format(requestDate, "EEE, d MMMM", { locale: it }),
      time: format(requestDate, "HH:mm"),
    }
  }

  return (
    <div className="container mx-auto px-4 md:px-6 space-y-6 md:space-y-8 py-8 md:py-12">
      <div>
        <div className="text-sm text-muted-foreground">{user.username}</div>
        <h1 className="text-4xl poppins-semibold">Bentornato</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button variant="outline" className="h-20 md:h-24 bg-violet-500 hover:bg-violet-480 border-0" onClick={handleCalendarClick}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full  flex items-center justify-center">
              <Calendar className="h-6 w-6 md:h-12 md:w-8 text-white" />
            </div>
            <span className="text-base text-white md:text-lg">Calendario</span>
          </div>
        </Button>

        <Button variant="outline" className="h-20 md:h-24 bg-emerald-500 hover:bg-emerald-400  border-0" onClick={handleRequestClick}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full  flex items-center justify-center">
              <Briefcase className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
            <span className="text-base md:text-lg text-white">Richiedi ferie o permesso</span>
          </div>
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Nuove sessioni</h2>

        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-white">
                <TableHead className="font-medium whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    Giorno richiesta
                  </div>
                </TableHead>
                <TableHead className="font-medium whitespace-nowrap">Utente</TableHead>
                <TableHead className="font-medium whitespace-nowrap">Servizi</TableHead>
                <TableHead className="font-medium whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    Data e fascia oraria
                  </div>
                </TableHead>
                <TableHead className="font-medium whitespace-nowrap">Sala</TableHead>
                <TableHead className="font-medium whitespace-nowrap">Stato</TableHead>
                <TableHead className="font-medium"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => {
                //@ts-ignore
                const requestDate = formatRequestDate(booking.start)

                return (
                  //@ts-ignore
                  <TableRow key={booking.id} className="border-t">
                    <TableCell className="align-top">
                      <div>{requestDate.day}</div>
                      <div className="text-gray-500">{requestDate.time}</div>
                    </TableCell>
                    {/* @ts-ignore */}
                    <TableCell>{booking.user.username}</TableCell>
                    <TableCell className="align-top">
                      {/* @ts-ignore */}
                      {booking.services.map((service, index) => (
                        <div className="px-1 py-1 text-xs bg-gray-100 rounded-sm w-fit m-1" key={index}>{getServiceName(service.id)}</div>
                      ))}
                    </TableCell>
                    <TableCell className="align-top">
                      {/* @ts-ignore */}
                      <div>{formatDate(booking.start)}</div>
                      <div className="flex gap-4 text-gray-500">
                        {/* @ts-ignore */}
                        <span>{formatTime(booking.start)}</span>
                        {/* @ts-ignore */}
                        <span>{formatTime(booking.end)}</span>
                      </div>
                    </TableCell>
                    {/* @ts-ignore */}
                    <TableCell><p className="px-2 py-1 text-xs rounded-sm bg-gray-100 w-fit">{getStudioName(booking.studioId)}</p></TableCell>
                    {/* @ts-ignore */}
                    <TableCell className={!booking.isWithinAvailability ? "text-red-500" : "text-green-500"}>
                      {/* @ts-ignore */}
                      {!booking.isWithinAvailability ? "Fuori orario" : "Accettata"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        className="rounded-full px-6 py-2 h-auto"
                        onClick={() => handleViewSession(booking)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Visualizza</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent className="sm:max-w-[500px] w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Richiedi ferie</DialogTitle>
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh]">
            <div className="grid gap-6 py-4 pr-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className={`h-24 relative ${requestType === "FERIE" ? "border-2 border-red-400" : ""}`}
                  onClick={() => handleTypeSelect("FERIE")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-red-400 flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-lg">Ferie</span>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className={`h-24 relative ${requestType === "PERMESSO" ? "border-2 border-orange-400" : ""}`}
                  onClick={() => handleTypeSelect("PERMESSO")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-orange-400 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-lg">Permesso</span>
                  </div>
                </Button>
              </div>

              {requestType && (
                <>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Data e ora</h3>
                    {requestType === "FERIE" ? (
                      <div className="space-y-4">
                        <div className="border rounded-md p-4">
                          <div className="mb-4">
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                              type="button"
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {formatDateRange()}
                            </Button>
                          </div>
                          <CalendarComponent
                            mode="range"
                            selected={dateRange}
                            onSelect={(range: any) => {
                              if (range) {
                                setDateRange(range)
                              }
                            }}
                            locale={it}
                            initialFocus
                            className="rounded-md"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="border rounded-md p-4">
                          <div className="mb-4">
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                              type="button"
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {formatSingleDate()}
                            </Button>
                          </div>
                          <CalendarComponent
                            mode="single"
                            selected={singleDate}
                            onSelect={(date) => {
                              if (date) {
                                //@ts-ignore
                                setSingleDate(date)
                              }
                            }}
                            locale={it}
                            initialFocus
                            className="rounded-md"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Ora inizio</label>
                            <Select value={startTime} onValueChange={setStartTime}>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleziona ora" />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Ora fine</label>
                            <Select value={endTime} onValueChange={setEndTime}>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleziona ora" />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-lg font-semibold">Motivazione</label>
                    <Textarea
                      value={motivazione}
                      onChange={(e) => setMotivazione(e.target.value)}
                      placeholder="Inserisci la motivazione della richiesta..."
                      className="min-h-[100px]"
                    />
                  </div>
                </>
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="flex sm:justify-between gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setRequestDialogOpen(false)}>
              Annulla
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={
                !requestType ||
                !motivazione ||
                (requestType === "FERIE" && (!dateRange.from || !dateRange.to)) ||
                (requestType === "PERMESSO" && (!singleDate || !startTime || !endTime))
              }
            >
              Conferma
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewSessionDialogOpen} onOpenChange={setViewSessionDialogOpen}>
        <DialogContent className="sm:max-w-[500px] w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            {/* @ts-ignore */}
            <DialogTitle className="text-center flex-1">{selectedBooking?.user.username}</DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <ScrollArea className="max-h-[80vh]">
              <div className="space-y-6 py-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Data e ora</h3>
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 rounded-md py-2 px-2 flex-1">
                      <span>{formatDate(selectedBooking.start)}</span>
                    </div>
                    <div className="bg-gray-100 rounded-md py-2 px-2 w-24 text-center">
                      <span>{formatTime(selectedBooking.start)}</span>
                    </div>
                    <span>-</span>
                    <div className="bg-gray-100 rounded-md py-2 px-2 w-24 text-center">
                      <span>{formatTime(selectedBooking.end)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Nome artista</h3>
                  {/* @ts-ignore */}
                  <Input value={selectedBooking.user.username} className="w-full" readOnly />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Servizi</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedBooking.services.map((service, index) => {
                      {/* @ts-ignore */}
                      const serviceName = getServiceName(service.id)
                      const isAffittoSala = serviceName === "Affitto sala"
                      const isRegistrazione = serviceName === "Registrazione"
                      const isMixMaster = serviceName === "Mix&Master"
                      return (
                          <span className="px-2 py-1 rounded-sm bg-gray-100 w-fit text-xs">
                            {isAffittoSala && "Affitto sala"}
                            {isRegistrazione && "Registrazione"}
                            {isMixMaster && "Mix & Master"}
                            {!isAffittoSala && !isRegistrazione && !isMixMaster && serviceName}
                          </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

