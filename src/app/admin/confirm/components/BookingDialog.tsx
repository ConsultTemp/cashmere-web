"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, AlertCircle, Phone } from 'lucide-react'
import type { Booking } from "@/types/booking"
import { Button } from "@/components/Button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/Dialog"
import { Separator } from "@/components/Separator"
import { ScrollArea } from "@/components/ScrollArea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/Command"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select"
import { cn } from "@/lib/utils"
import { services, studios } from "@/lib/types"
import { useUser } from "@/hooks/useUser"
import { useBooking } from "@/hooks/useBooking"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Report } from "@/types/types"

interface ViewBookingDialogProps {
  isOpen: boolean
  onClose: () => void
  booking: Booking | null
  onAccept: () => void
  onReject: () => void
  report: Report | null | undefined
}

interface AvailabilityStatus {
  isAvailable: boolean
  reason?: string
}

// ID del fonico che deve essere sempre disponibile
const ALWAYS_AVAILABLE_FONICO_ID = "cm8z06fn00002mytvfftqrkgx"

export function ViewBookingDialog({ isOpen, onClose, booking, onAccept, onReject, report }: ViewBookingDialogProps) {
  const [openUserCombobox, setOpenUserCombobox] = useState(false)
  const [openFonicoCombobox, setOpenFonicoCombobox] = useState(false)
  const [openStudioCombobox, setOpenStudioCombobox] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const [fonicos, setFonicos] = useState<any[]>([])
  const [availableStudios, setAvailableStudios] = useState<any[]>([])
  const [selectedServices, setSelectedServices] = useState<any[]>([])
  const [selectedFonico, setSelectedFonico] = useState<string | null>(null)
  const [selectedStudio, setSelectedStudio] = useState<string | null>(null)
  const [fonicoAvailability, setFonicoAvailability] = useState<Record<string, AvailabilityStatus>>({})
  const [studioAvailability, setStudioAvailability] = useState<Record<string, AvailabilityStatus>>({})
  const [hasAvailabilityIssues, setHasAvailabilityIssues] = useState(false)
  const [isModified, setIsModified] = useState(false)

  const { getUsers, getEngineers } = useUser()
  const { getAvailableEngineers, getAvailableStudios, bookingUpdate, updateBookingState } = useBooking()

  useEffect(() => {
    const fetchUsers = async () => {
      const usrs = await getUsers()
      setUsers(usrs)
      const engns = await getEngineers()
      setFonicos(engns)
    }
    fetchUsers()
  }, [])

  useEffect(() => {
    if (booking) {
      // Converti gli ID dei servizi in oggetti servizio
      const serviceObjects = booking.services.map((serviceId) => {
        const service = services.find((s) => s.id === serviceId)
        return service || { id: serviceId, name: serviceId }
      })
      setSelectedServices(serviceObjects)

      // Imposta il fonico e lo studio selezionati
      setSelectedFonico(booking.fonicoId)
      setSelectedStudio(booking.studioId)

      // Reset dello stato di modifica
      setIsModified(false)

      // Verifica la disponibilità
      checkAvailability(booking)
    }
  }, [booking])

  const checkAvailability = async (booking: Booking) => {
    if (!booking) return

    try {
      // Verifica la disponibilità dei fonici
      const availableEngineers = await getAvailableEngineers(booking.start, booking.end)
      console.log(availableEngineers)
      const fonicoStatus: Record<string, AvailabilityStatus> = {}
      console.log(fonicos)
      fonicos.forEach((fonico) => {
        // Se il fonico ha l'ID speciale, lo consideriamo sempre disponibile
        if (fonico.id === ALWAYS_AVAILABLE_FONICO_ID) {
          fonicoStatus[fonico.id] = {
            isAvailable: true,
            reason: undefined,
          }
        } else {
          const isAvailable = availableEngineers.some(
            (engineer: any) => engineer.id === fonico.id && engineer.isAvailable,
          )
          fonicoStatus[fonico.id] = {
            isAvailable,
            reason: isAvailable ? undefined : "Non disponibile in questo orario",
          }
        }
      })
      console.log(fonicoStatus)
      setFonicoAvailability(fonicoStatus)

      // Verifica la disponibilità degli studi
      const availableStudiosList = await getAvailableStudios(booking.start, booking.end)
      setAvailableStudios(availableStudiosList)
      console.log(availableStudiosList)

      const studioStatus: Record<string, AvailabilityStatus> = {}
      studios.forEach((studio) => {
        const isAvailable = availableStudiosList.some((s: any) => s.id === studio.id && s.isAvailable)
        studioStatus[studio.id] = {
          isAvailable,
          reason: isAvailable ? undefined : "Studio occupato in questo orario",
        }
      })
      console.log(studioStatus)
      setStudioAvailability(studioStatus)

      // Verifica se ci sono problemi di disponibilità con le selezioni attuali
      // Se il fonico selezionato è quello speciale, consideriamo solo la disponibilità dello studio
      if (selectedFonico === ALWAYS_AVAILABLE_FONICO_ID) {
        const currentStudioAvailable = studioStatus[selectedStudio || booking.studioId]?.isAvailable
        setHasAvailabilityIssues(!currentStudioAvailable)
      } else {
        updateAvailabilityIssues(
          selectedFonico || booking.fonicoId,
          selectedStudio || booking.studioId,
          fonicoStatus,
          studioStatus,
        )
      }
    } catch (error) {
      console.error("Errore nel controllo della disponibilità:", error)
    }
  }

  const updateAvailabilityIssues = (
    fonicoId: string,
    studioId: string,
    fonicoStatusMap = fonicoAvailability,
    studioStatusMap = studioAvailability,
  ) => {
    // Se il fonico è quello speciale, lo consideriamo sempre disponibile
    const currentFonicoAvailable = fonicoId === ALWAYS_AVAILABLE_FONICO_ID ? true : fonicoStatusMap[fonicoId]?.isAvailable
    const currentStudioAvailable = studioStatusMap[studioId]?.isAvailable

    setHasAvailabilityIssues(!currentFonicoAvailable || !currentStudioAvailable)
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

  const handleFonicoChange = (fonicoId: string) => {
    setSelectedFonico(fonicoId)
    setOpenFonicoCombobox(false)
    setIsModified(true)

    // Aggiorna lo stato di disponibilità
    // Se il fonico è quello speciale, consideriamo solo la disponibilità dello studio
    if (fonicoId === ALWAYS_AVAILABLE_FONICO_ID) {
      const currentStudioAvailable = studioAvailability[selectedStudio || booking?.studioId || ""]?.isAvailable
      setHasAvailabilityIssues(!currentStudioAvailable)
    } else {
      updateAvailabilityIssues(fonicoId, selectedStudio || booking?.studioId || "")
    }
  }

  const handleStudioChange = (studioId: string) => {
    setSelectedStudio(studioId)
    setOpenStudioCombobox(false)
    setIsModified(true)

    // Aggiorna lo stato di disponibilità
    // Se il fonico è quello speciale, consideriamo solo la disponibilità dello studio
    if (selectedFonico === ALWAYS_AVAILABLE_FONICO_ID) {
      const currentStudioAvailable = studioAvailability[studioId]?.isAvailable
      setHasAvailabilityIssues(!currentStudioAvailable)
    } else {
      updateAvailabilityIssues(selectedFonico || booking?.fonicoId || "", studioId)
    }
  }

  const getStudioName = (studioId: string): string => {
    const studio = studios.find((s) => s.id === studioId)
    return studio ? studio.name : studioId
  }

  const handleSaveChanges = async () => {
    if (!booking || !isModified) return

    try {
      // Crea l'oggetto con le modifiche
      const updatedBooking = {
        fonicoId: selectedFonico,
        studioId: selectedStudio,
      }
      console.log({ ...booking, ...updatedBooking })
      // Invia l'aggiornamento
      //@ts-ignore
      await bookingUpdate(booking.id, { ...booking, ...updatedBooking, services: booking.services.map((s) => s.id) })

      // Chiudi il dialog
      onClose()
    } catch (error) {
      console.error("Errore durante il salvataggio delle modifiche:", error)
    }
  }

  const handleContact = async () => {
    if (!booking) return

    try {
      // Aggiorna lo stato a CONTATTATO
      await updateBookingState(booking.id, "CONTATTATO")

      // Formatta il numero di telefono (rimuovi spazi, +, ecc.)
      //@ts-ignore
      const phoneNumber = booking.phone.replace(/\s+/g, "").replace(/^\+/, "")

      // Apri WhatsApp in una nuova finestra
      window.open(`https://wa.me/${phoneNumber}`, "_blank")
    } catch (error) {
      console.error("Errore durante il contatto del cliente:", error)
    }
  }

  const accept = async () => {
    await handleSaveChanges()
    onAccept()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
       {/*  @ts-ignore */}
          <DialogTitle className="text-center flex-1">{booking?.user.username}</DialogTitle>
        </DialogHeader>

        {booking && (
          <ScrollArea className="max-h-[70vh] no-scrollbar">
            <div className="space-y-6 pt-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Data e ora</h3>
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 rounded-md py-[3.5px] px-4 flex-1">
                    <span>{formatDate(booking.start)}</span>
                  </div>
                  <div className="bg-gray-100 rounded-md py-[3.5px] px-4 w-24 text-center">
                    <span>{formatTime(booking.start)}</span>
                  </div>
                  <span>-</span>
                  <div className="bg-gray-100 rounded-md py-[3.5px] px-4 w-24 text-center">
                    <span>{formatTime(booking.end)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Nome artista</h3>
                <Popover open={openUserCombobox} onOpenChange={setOpenUserCombobox}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openUserCombobox}
                      className="w-full justify-between"
                    >
                        {/*  @ts-ignore */}
                      {booking.userId ? users.find((user) => user.id === booking.userId)?.username || booking.user.username
                        : "Seleziona cliente"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Cerca cliente..." />
                      <CommandList>
                        <CommandEmpty>Nessun cliente trovato.</CommandEmpty>
                        <CommandGroup>
                          {users.map((user) => (
                            <CommandItem
                              key={user.id}
                              value={user.username}
                              onSelect={() => {
                                setOpenUserCombobox(false)
                              }}
                            >
                              <Check
                                className={cn("mr-2 h-4 w-4", booking.userId === user.id ? "opacity-100" : "opacity-0")}
                              />
                              {user.username}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Selezione Fonico */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Fonico</h3>
                <Popover open={openFonicoCombobox} onOpenChange={setOpenFonicoCombobox}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openFonicoCombobox}
                      className="w-full justify-between"
                    >
                      {selectedFonico
                        ? fonicos.find((fonico) => fonico.id === selectedFonico)?.username || selectedFonico
                        : "Seleziona fonico"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Cerca fonico..." />
                      <CommandList>
                        <CommandEmpty>Nessun fonico trovato.</CommandEmpty>
                        <CommandGroup>
                          {fonicos.map((fonico) => {
                            // Se il fonico ha l'ID speciale, lo mostriamo sempre come disponibile
                            const isSpecialFonico = fonico.id === ALWAYS_AVAILABLE_FONICO_ID
                            const availability = fonicoAvailability[fonico.id]
                            const isAvailable = isSpecialFonico ? true : availability?.isAvailable

                            return (
                              <CommandItem
                                key={fonico.id}
                                value={fonico.username}
                                onSelect={() => handleFonicoChange(fonico.id)}
                                className={cn(
                                  isAvailable ? "text-green-600" : "text-red-600",
                                  "flex items-center justify-between",
                                )}
                              >
                                <div className="flex items-center">
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedFonico === fonico.id ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  {fonico.username}
                                  {isSpecialFonico && " (Sempre disponibile)"}
                                </div>
                                {!isAvailable && !isSpecialFonico && (
                                    // @ts-ignore 
                                  <AlertCircle className="h-4 w-4 ml-2" title={availability?.reason} />
                                )}
                              </CommandItem>
                            )
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Selezione Studio */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Studio</h3>
                <Popover open={openStudioCombobox} onOpenChange={setOpenStudioCombobox}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openStudioCombobox}
                      className="w-full justify-between"
                    >
                      {selectedStudio ? getStudioName(selectedStudio) : "Seleziona studio"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Cerca studio..." />
                      <CommandList>
                        <CommandEmpty>Nessuno studio trovato.</CommandEmpty>
                        <CommandGroup>
                          {studios.map((studio) => {
                            const availability = studioAvailability[studio.id]
                            const isAvailable = availability?.isAvailable

                            return (
                              <CommandItem
                                key={studio.id}
                                value={studio.name}
                                onSelect={() => handleStudioChange(studio.id)}
                                className={cn(
                                  isAvailable ? "text-green-600" : "text-red-600",
                                  "flex items-center justify-between",
                                )}
                              >
                                <div className="flex items-center">
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedStudio === studio.id ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  {studio.name}
                                </div>
                                  {/*  @ts-ignore */}
                                {!isAvailable && <AlertCircle className="h-4 w-4 ml-2" title={availability?.reason} />}
                              </CommandItem>
                            )
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Servizi</h3>
                <div>
                  <Select value="" disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Servizi" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedServices.map((service) => (
                      <div key={service.id} className="flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs">
                        {service.name.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {hasAvailabilityIssues && (
                <Alert variant="destructive" className="flex flex-row items-center">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Attenzione: ci sono problemi di disponibilità con il fonico o lo studio selezionato.
                  </AlertDescription>
                </Alert>
              )}

              {report && report.userId && (
                <Alert variant="destructive"  className="flex flex-row items-center">
                  <AlertCircle className="h-4 w-4 m-0" />
                  <AlertDescription className="text-xs flex flex-row items-center">Questo utente è stato precedentemente segnalato per la seguente ragione: {report.reason}</AlertDescription>
                </Alert>
              )}

              <DialogFooter className="sticky bottom-0 flex flex-col sm:flex-row sm:justify-between flex-wrap gap-2 px-0 bg-white py-4">
                {/* Prima riga di bottoni */}
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-500"
                    onClick={onReject}
                  >
                    Rifiuta
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-500"
                    onClick={handleContact}
                  >
                    Contatta
                  </Button>
                  <Button className="flex-1 bg-black text-white hover:bg-gray-800" onClick={accept} disabled={selectedFonico == "cm9pobzca000018y2aatml5bm" }>
                    Accetta
                  </Button>
                </div>

                {/* Seconda riga di bottoni */}
                <div className="flex flex-row justify-end w-full">
                  
                  {isModified && (
                    <Button className="w-fit  bg-green-600 text-white hover:bg-green-700" onClick={handleSaveChanges}>
                      Salva modifiche
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}
