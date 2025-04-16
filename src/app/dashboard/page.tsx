"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select"
import { Button } from "@/components/Button"
import { BookingCard } from "./components/BookingCard"
import { BookingFilters } from "./components/BookingFilters"
import { useBooking } from "@/hooks/useBooking"
import { BookingState } from "@/types/types"
import type { Booking } from "@/types/booking"
import { useUserStore } from "@/store/user-store"
import { MessageSquare, Pencil } from "lucide-react"
import { useRouter } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/Dialog"
import { Input } from "@/components/Input"

export default function DashboardPage() {
  const router = useRouter()
  const { user, clearUser, setUser } = useUserStore()
  const [filter, setFilter] = useState<BookingState | "future" | "past" | "pending">("future")
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  // Aggiungi questi stati per il dialog di cambio nome utente
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newUsername, setNewUsername] = useState("")
  const [error, setError ] = useState(false)
  const {updateUsername} = useUser()

  const { getUserBookings } = useBooking()

  useEffect(() => {
    async function fetchBookings() {
      const data = await getUserBookings(user.id)
      setBookings(data)
    }
    fetchBookings()
  }, [])

  const now = new Date()
  const filteredBookings = bookings
    .filter((booking) => {
      const bookingDate = new Date(booking.start)
      if (filter === "future") return booking.state === BookingState.CONFERMATO && bookingDate >= now
      if (filter === "past") return booking.state === BookingState.CONFERMATO && bookingDate < now
      if (filter === "pending")
        return booking.state === BookingState.CONTATTARE || booking.state === BookingState.CONTATTATO
      return booking.state === filter
    })
    .sort((a, b) => {
      if (sortOrder === "recent") {
        return new Date(b.start).getTime() - new Date(a.start).getTime()
      }
      return new Date(a.start).getTime() - new Date(b.start).getTime()
    })

  const handleContactWhatsApp = () => {
    window.open(`https://wa.me/3514206294`, "_blank")
  }

  const handleLogout = () => {
    // Esegui il logout dallo store
    clearUser()

    // Reindirizza alla home page
    router.push("/")
  }

  // Aggiungi questa funzione per gestire il cambio nome utente
  const handleUsernameUpdate = async ()  => {
    const data = await updateUsername(user.id, newUsername)
    console.log(data)
    if(data && data.username){
      setUser({...user, username: newUsername})
      setError(false)
      setIsDialogOpen(false)
    }else{
      setError(true)
    }
    
  }

  return (
    <div className="">
      <div className="flex-1 flex flex-col w-full items-center overflow-y-auto">
        <div className="container py-8 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-72">
          {/* Header */}
          <div className="flex items-center justify-between">
            {/* Modifica qui per aggiungere il popover */}
            <Popover>
              <PopoverTrigger asChild>
                <h1 className="text-xl font-semibold cursor-pointer hover:underline flex flex-row gap-2 items-center">{user.username} <Pencil className="w-4 h-4"/></h1>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="space-y-2">
                  <h4 className="font-medium">Il tuo account</h4>
                  <Button
                    variant="outline"
                    color="black"
                    className="w-full justify-start"
                    onClick={() => {setIsDialogOpen(true); setNewUsername(user.username)}}
                  >
                    Cambia nome utente
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Button onClick={handleLogout} className="my-4" variant="outline">
            Logout
          </Button>
          {/* Bookings Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Le tue prenotazioni</h2>
              <Select defaultValue={sortOrder} onValueChange={(value) => setSortOrder(value as "recent" | "oldest")}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Ordina per" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Più recenti</SelectItem>
                  <SelectItem value="oldest">Meno recenti</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <BookingFilters onFilterChange={setFilter} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBookings.length > 0 &&
                filteredBookings.map((booking, _i) => (
                  <div key={booking.userId + booking.start + _i} onClick={() => setSelectedBooking(booking)}>
                    <BookingCard booking={booking} />
                  </div>
                ))}
              {filteredBookings.length < 1 && (
                <p className="w-full whitespace-nowrap mt-10 px-2 rounded-lg">
                  Nessuna prenotazione{" "}
                  {filter == "future" ? "in programma" : filter == "past" ? "passata" : "in attesa di conferma"}
                </p>
              )}
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-16 space-y-4">
            <h3 className="text-xl font-semibold">Contatta segreteria</h3>
            <Button variant="secondary" onClick={handleContactWhatsApp} className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Contatta segreteria
            </Button>
          </div>
        </div>
      </div>

      {selectedBooking && (
        <BookingViewDialog
          booking={selectedBooking}
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}

      {/* Aggiungi il dialog per il cambio nome utente */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambia nome utente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Nuovo nome utente
              </label>
              <Input
                id="username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Inserisci nuovo nome utente"
              />
              {error && <p className="text-xs text-red-500">Questo nome utente appartiente gia ad un altro user.</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" color="black" onClick={() => setIsDialogOpen(false)}>
              Annulla
            </Button>
            <Button color="black" onClick={handleUsernameUpdate}>
              Salva
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

import {
  Dialog as BookingDialog,
  DialogContent as BookingDialogContent,
  DialogHeader as BookingDialogHeader,
  DialogTitle as BookingDialogTitle,
  DialogFooter as BookingDialogFooter,
} from "@/components/Dialog"
import { format } from "date-fns"
import { it } from "date-fns/locale"
import { services, studios } from "@/lib/types"
import { useUser } from "@/hooks/useUser"

interface BookingViewDialogProps {
  booking: Booking
  isOpen: boolean
  onClose: () => void
}

function BookingViewDialog({ booking, isOpen, onClose }: BookingViewDialogProps) {
  console.log(booking)
  // Funzione per ottenere il nome dello studio
  const getStudioName = (studioId: string) => {
    const studio = studios.find((s) => s.id === studioId)
    return studio ? studio.name : "Studio non trovato"
  }

  // Funzione per ottenere il nome del fonico
  const getEngineerName = (fonicoId: string) => {
    return fonicoId || "Non assegnato"
  }

  // Funzione per ottenere i nomi dei servizi
  const getServiceNames = (serviceIds: any[]) => {
    return serviceIds.map((serviceId) => {
      const service =
        typeof serviceId === "string"
          ? services.find((s) => s.id === serviceId)
          : services.find((s) => s.id === serviceId.id)
      return service ? service.name : "Servizio non trovato"
    })
  }

  return (
    <BookingDialog open={isOpen} onOpenChange={onClose}>
      <BookingDialogContent className="sm:max-w-[500px]">
        <BookingDialogHeader>
          <BookingDialogTitle>Dettagli Prenotazione</BookingDialogTitle>
        </BookingDialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <h3 className="text-sm font-medium">Data</h3>
            <p className="mt-1 text-sm">
              {booking.start ? format(new Date(booking.start), "EEEE d MMMM yyyy", { locale: it }) : "Non specificata"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium">Ora inizio</h3>
              <p className="mt-1 text-sm">
                {booking.start ? format(new Date(booking.start), "HH:mm") : "Non specificata"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Ora fine</h3>
              <p className="mt-1 text-sm">{booking.end ? format(new Date(booking.end), "HH:mm") : "Non specificata"}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium">Studio</h3>
            <p className="mt-1 text-sm">{booking.studioId ? getStudioName(booking.studioId) : "Non specificato"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium">Fonico</h3>
            <p className="mt-1 text-sm">{booking.fonicoId ? booking?.fonico?.username : "Non specificato"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium">Servizi</h3>
            <div className="mt-1 flex flex-wrap gap-2">
              {booking.services && booking.services.length > 0 ? (
                getServiceNames(booking.services).map((name, index) => (
                  <div key={index} className="rounded-full bg-primary/10 px-3 py-1 text-xs">
                    {name}
                  </div>
                ))
              ) : (
                <p className="text-sm">Nessun servizio selezionato</p>
              )}
            </div>
          </div>

          {booking.notes && (
            <div>
              <h3 className="text-sm font-medium">Note</h3>
              <p className="mt-1 text-sm whitespace-pre-wrap">{booking.notes}</p>
            </div>
          )}

          <BookingDialogFooter>
            <Button onClick={onClose}>OK</Button>
          </BookingDialogFooter>
        </div>
      </BookingDialogContent>
    </BookingDialog>
  )
}
