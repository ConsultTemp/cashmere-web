"use client"

import { useState, useMemo, useEffect } from "react"
import { Check, Eye, ArrowUpDown, OctagonAlert } from "lucide-react"
import type { Booking, Report } from "@/types/booking"
import { BookingState, type StateType } from "@/types/types"
import { Button } from "@/components/Button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/Dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/Pagination"
import { useBooking } from "@/hooks/useBooking"
import { ViewBookingDialog } from "./components/BookingDialog"

// Importa gli studios e i services
import { studios, services } from "@/lib/types"
import { useReport } from "@/hooks/useReport"

type SortDirection = "asc" | "desc" | null
type SortField = "start" | "created_at" | null

export default function Confirm() {
  const [bookingsState, setBookingsState] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [reports, setReports] = useState([])
  const [report , setReport] = useState()
  const { getToConfirm, updateBookingState } = useBooking()
  const { getAll } = useReport()
  useEffect(() => {
    const fetchBookings = async () => {
      const data = await getToConfirm()
      console.log(data)
      setBookings(data)
      setBookingsState(data)
    }
    const fetchReports = async () => {
      const data = await getAll()
      console.log(data)
      setReports(data)
    }

    // Effettua il fetch solo una volta
    if (bookings.length === 0) {
      fetchBookings()
    }
    fetchReports()
  }, [bookings.length])

  const refresh = async () => {
    const data = await getToConfirm()
    console.log(data)
    setBookings(data)
    setBookingsState(data)
  }

  // Stato per paginazione
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Stato per ordinamento
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  // Gestione ordinamento
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cambia direzione se il campo è già selezionato
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortDirection(null)
        setSortField(null)
      } else {
        setSortDirection("asc")
      }
    } else {
      // Imposta nuovo campo e direzione ascendente
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Prenotazioni ordinate e paginate
  const sortedAndPaginatedBookings = useMemo(() => {
    // Ordina le prenotazioni
    const sorted = [...bookingsState]

    if (sortField && sortDirection) {
      sorted.sort((a, b) => {
        let valueA: number = 0
        let valueB: number = 0

        if (sortField === "start") {
          valueA = new Date(a.start).getTime()
          valueB = new Date(b.start).getTime()
        } else if (sortField === "created_at") {
          valueA = new Date(a.created_at).getTime()
          valueB = new Date(b.created_at).getTime()
        }

        return sortDirection === "asc" ? valueA - valueB : valueB - valueA
      })
    }


    // Calcola gli indici per la paginazione
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    // Restituisci le prenotazioni paginate
    return sorted.slice(startIndex, endIndex)
  }, [bookingsState, currentPage, sortField, sortDirection])

  // Calcola il numero totale di pagine
  const totalPages = Math.ceil(bookingsState.length / itemsPerPage)

  const handleView = (booking: Booking) => {
    setSelectedBooking(booking)
    setReport(reports.find((r: Report) => r.userId == booking.userId))
    setViewDialogOpen(true)
  }

  const handleConfirm = (booking: Booking) => {
    setSelectedBooking(booking)
    setConfirmDialogOpen(true)
  }

  const confermaPrenotazione = () => {
    if (!selectedBooking) return

    // Aggiorna lo stato della prenotazione
    const updatedBookings = bookingsState.map((b) =>
      b.id === selectedBooking.id ? { ...b, state: "CONTATTATO" as BookingState } : b,
    )

    setBookingsState(updatedBookings)
    setConfirmDialogOpen(false)
    setViewDialogOpen(false)
  }

  const rifiutaPrenotazione = () => {
    if (!selectedBooking) return

    // Rimuovi la prenotazione dalla lista
    const updatedBookings = bookingsState.filter((b) => b.id !== selectedBooking.id)

    setBookingsState(updatedBookings)
    setViewDialogOpen(false)
  }

  // Funzioni helper per ottenere i nomi
  const getStudioName = (studioId: string): string => {
    const studio = studios.find((s) => s.id === studioId)
    return studio ? studio.name : studioId
  }

  const getServiceName = (serviceId: string): string => {
    const service = services.find((s) => s.id === serviceId)
    return service ? service.name : serviceId
  }

  // Formatta data e ora
  const formatDate = (date: Date | string): string => {
    const d = new Date(date)
    return d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" })
  }

  const formatTime = (date: Date | string): string => {
    const d = new Date(date)
    return d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })
  }

  // Genera array di numeri di pagina da visualizzare
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Mostra tutte le pagine se sono meno del massimo
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Logica per mostrare pagine con ellipsis
      if (currentPage <= 3) {
        // Inizio: mostra le prime 3 pagine, ellipsis, ultima pagina
        for (let i = 1; i <= 3; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push("ellipsis")
        pageNumbers.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // Fine: mostra prima pagina, ellipsis, ultime 3 pagine
        pageNumbers.push(1)
        pageNumbers.push("ellipsis")
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pageNumbers.push(i)
        }
      } else {
        // Medio: mostra prima pagina, ellipsis, pagina corrente e adiacenti, ellipsis, ultima pagina
        pageNumbers.push(1)
        pageNumbers.push("ellipsis")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push("ellipsis")
        pageNumbers.push(totalPages)
      }
    }

    return pageNumbers
  }

  // Aggiorna la funzione handleAcceptRefuse per includere il fonico e lo studio selezionati
  const handleAcceptRefuse = (id: string, state: StateType, fonicoId?: string, studioId?: string) => {
    if (!selectedBooking) return

    // Crea un oggetto con i dati da aggiornare
    const updateData: any = { state }

    // Aggiungi fonico e studio se forniti
    if (fonicoId) updateData.fonicoId = fonicoId
    if (studioId) updateData.studioId = studioId

    setConfirmDialogOpen(false)
    setViewDialogOpen(false)

    // Aggiorna lo stato e potenzialmente il fonico e lo studio
    updateBookingState(id, state, updateData)
    setTimeout(() => {
      refresh()
    }, 1000)
  }

  return (
    <div className="max-w-6xl mx-auto sm:p-4 md:p-6 py-8 sm:py-12 h-screen overflow-y-auto">
      <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Conferma prenotazioni</h1>
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-white">
              <TableHead className="font-medium">
                <button
                  className="flex items-center gap-1 hover:text-gray-700"
                  onClick={() => handleSort("created_at")}
                >
                  Giorno richiesta
                  <ArrowUpDown className={`h-6 w-6 ${sortField === "created_at" ? "text-primary" : "text-gray-400"}`} />

                </button>
              </TableHead>
              <TableHead className="font-medium">Utente</TableHead>
              <TableHead className="font-medium">Servizi</TableHead>
              <TableHead className="font-medium">Fonico</TableHead>
              <TableHead className="font-medium">
                <button className="flex items-center gap-1 hover:text-gray-700" onClick={() => handleSort("start")}>
                  Data e fascia oraria
                  <ArrowUpDown className={`h-6 w-6 ${sortField === "start" ? "text-primary" : "text-gray-400"}`} />

                </button>
              </TableHead>
              <TableHead className="font-medium">Sala</TableHead>
              <TableHead className="font-medium">Stato</TableHead>
              <TableHead className="font-medium"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndPaginatedBookings.map((booking) => (
              <TableRow key={booking.id} className="border-t">
                <TableCell className="align-center">
                  <div>{formatDate(booking.created_at)}</div>
                  <div className="text-gray-500">{formatTime(booking.created_at)}</div>
                </TableCell>
                <TableCell className="whitespace-nowrap flex flex-row items-center gap-2">
                  {/* @ts-ignore */}
                  {booking.user.username}
                  {/* @ts-ignore */}
                  {reports.some((r) => r.userId == booking.userId) && <OctagonAlert className="w-4 h-4 text-red-500" />}
                </TableCell>
                <TableCell className="align-center">

                  {booking.services.map((service, index) => (
                    //@ts-ignore
                    <div key={index}>{service.name}</div>
                  ))}
                </TableCell>
                <TableCell className={booking.fonicoId === "Estel" ? "text-pink-500" : "text-gray-500"}>
                  {/* @ts-ignore */}
                  {booking.fonico.username}
                </TableCell>
                <TableCell className="align-center">
                  <div>{formatDate(booking.start)}</div>
                  <div className="flex gap-4 text-gray-500">
                    <span>{formatTime(booking.start)}</span>
                    <span>{formatTime(booking.end)}</span>
                  </div>
                </TableCell>
                <TableCell>{getStudioName(booking.studioId)}</TableCell>
                <TableCell className={booking.state === "CONTATTATO" ? "text-orange-500" : "text-red-500"}>
                  {booking.state}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      className="rounded-full px-3 sm:px-6 py-2 h-auto"
                      onClick={() => handleView(booking)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Visualizza</span>
                    </Button>
                    <Button
                      variant="gradient"
                      className="rounded-full px-3 sm:px-6 py-2 h-auto"
                      onClick={() => handleConfirm(booking)}
                    >
                      <Check className="h-4 w-4" />
                      <span className="sr-only">Conferma</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginazione */}
      {totalPages > 1 && (
        <div className="mt-4 overflow-x-auto">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) setCurrentPage(currentPage - 1)
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {getPageNumbers().map((page, index) =>
                page === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === page}
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(page as number)
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Usa il componente ViewBookingDialog */}
      <ViewBookingDialog
        isOpen={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        booking={selectedBooking}
        report={report}
        onAccept={() => selectedBooking && handleAcceptRefuse(selectedBooking.id, BookingState.CONFERMATO)}
        onReject={() => selectedBooking && handleAcceptRefuse(selectedBooking.id, BookingState.ANNULLATO)}
      />

      {/* Conferma Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center">Conferma prenotazione</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center">
            <p className="text-lg mb-2">Sei sicuro di voler confermare questa prenotazione?</p>
            <p className="text-sm text-gray-500">
              {/* @ts-ignore */}
              {selectedBooking?.user.username} - {selectedBooking && formatDate(selectedBooking.start)}
            </p>
          </div>
          <DialogFooter className="flex sm:justify-between gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setConfirmDialogOpen(false)}>
              Annulla
            </Button>
            <Button
              className="flex-1"
              onClick={() => selectedBooking && handleAcceptRefuse(selectedBooking.id, BookingState.CONFERMATO)}
            >
              Conferma
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

