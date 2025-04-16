"use client"

import { useEffect, useState } from "react"
import { Check, X, ArrowUpDown, Eye } from "lucide-react"
import { format, differenceInDays, differenceInHours } from "date-fns"
import { it } from "date-fns/locale"

import { Button } from "@/components/Button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/Dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Table"
import { ScrollArea } from "@/components/ScrollArea"
import { Badge } from "@/components/Badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs"
import { useHoliday } from "@/hooks/useHoliday"
import { HolidayState } from "@/types/types"
import { useUser } from "@/hooks/useUser"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select"
import { User, useUserStore } from "@/store/user-store"

// Tipo per le ferie/permessi
interface Holiday {
  id?: string // Aggiungiamo un ID per gestire le richieste
  userId: string
  start: Date
  end: Date
  reason: string
  state?: "CONFERMARE" | "CONFERMATO" | "ANNULLATO" // Aggiungiamo uno stato
  userName?: string // Nome dell'utente per visualizzazione
}

export default function HolidaysApprovalPage() {
  const { user } = useUserStore()
  const [requests, setRequests] = useState<Holiday[]>([])
  const [selectedRequest, setSelectedRequest] = useState<Holiday | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [engineers, setEngineers] = useState<User[]>([])
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("CONFERMARE")
  const [selectedFonico, setSelectedFonico] = useState(user.role == "ENGINEER" ? user.id : "all")
  const { getAll, updateHolidayState } = useHoliday()
  const { getEngineers } = useUser()

  // Filtra le richieste in base alla tab attiva
  const filteredRequests = requests.filter((request) => {
    if (activeTab === "CONFERMARE") return request.state === "CONFERMARE" && (request.userId == selectedFonico || selectedFonico == "all")
    if (activeTab === "CONFERMATO") return request.state === "CONFERMATO" && (request.userId == selectedFonico || selectedFonico == "all")
    if (activeTab === "ANNULLATO") return request.state === "ANNULLATO" && (request.userId == selectedFonico || selectedFonico == "all")
    return (request.userId == selectedFonico || selectedFonico == "all")
  })

  useEffect(() => {
    const fetchRequests = async () => {
      const reqs = await getAll()
      console.log(reqs)
      setRequests(reqs)
    }
    const fetchEngineers = async () => {
      const reqs = await getEngineers()
      console.log(reqs)
      setEngineers(reqs)
    }
    fetchEngineers()
    fetchRequests()
  }, [])

  const refresh = async () => {
    const reqs = await getAll()
    console.log(reqs)
    setRequests(reqs)
  }

  const handleViewRequest = (request: Holiday) => {
    setSelectedRequest(request)
    setViewDialogOpen(true)
  }

  const handleApproveRequest = () => {
    if (!selectedRequest) return

    // Aggiorna lo stato della richiesta
    const updatedRequests = requests.map((req) =>
      req.id === selectedRequest.id ? { ...req, state: "CONFERMATO" as const } : req,
    )

    setRequests(updatedRequests)
    setViewDialogOpen(false)
    setConfirmDialogOpen(false)
  }

  const handleRejectRequest = () => {
    if (!selectedRequest) return

    // Aggiorna lo stato della richiesta
    const updatedRequests = requests.map((req) =>
      req.id === selectedRequest.id ? { ...req, status: "ANNULLATO" as const } : req,
    )

    setRequests(updatedRequests)
    setViewDialogOpen(false)
    setRejectDialogOpen(false)
  }

  const isVacation = (holiday: Holiday): boolean => {
    const start = new Date(holiday.start) // Converte in Date
    const end = new Date(holiday.end) // Converte in Date

    const startHour = start.getHours()
    const startMinutes = start.getMinutes()
    const endHour = end.getHours()
    const endMinutes = end.getMinutes()

    return startHour === 5 && startMinutes === 0 && endHour === 5 && endMinutes === 0
  }


  // Formatta la durata della richiesta
  const formatDuration = (holiday: Holiday): string => {
    if (isVacation(holiday)) {
      // Per le ferie, calcola i giorni (considerando che finiscono alle 5 del mattino del giorno dopo)
      // Sottraiamo 1 perché l'ultimo giorno non è completo (finisce alle 5 del mattino)
      const days = differenceInDays(holiday.end, holiday.start)
      return `${days} ${days === 1 ? "giorno" : "giorni"}`
    } else {
      // Per i permessi, calcola le ore
      const hours = differenceInHours(holiday.end, holiday.start)
      return `${hours} ${hours === 1 ? "ora" : "ore"}`
    }
  }

  // Formatta la data per la visualizzazione
  const formatDate = (date: Date): string => {
    return format(date, "dd/MM/yyyy", { locale: it })
  }

  // Formatta l'ora per la visualizzazione
  const formatTime = (date: Date): string => {
    return format(date, "HH:mm")
  }

  // Formatta il periodo della richiesta
  const formatPeriod = (holiday: Holiday): string => {
    if (isVacation(holiday)) {
      // Per le ferie, mostra il range di date (considerando che finiscono alle 5 del mattino del giorno dopo)
      const endDate = new Date(holiday.end)
      endDate.setDate(endDate.getDate() - 1) // Sottraiamo 1 giorno perché finisce alle 5 del mattino del giorno dopo

      const startDateMidnight = new Date(holiday.start)
      startDateMidnight.setHours(0, 0, 0, 0)

      const endDateMidnight = new Date(endDate)
      endDateMidnight.setHours(0, 0, 0, 0)

      if (startDateMidnight.getTime() === endDateMidnight.getTime()) {
        // Se è un solo giorno
        return `${formatDate(holiday.start)}`
      }

      return `${formatDate(holiday.start)} - ${formatDate(endDate)}`
    } else {
      // Per i permessi, mostra la data e l'orario
      const startDateMidnight = new Date(holiday.start)
      startDateMidnight.setHours(0, 0, 0, 0)

      const endDateMidnight = new Date(holiday.end)
      endDateMidnight.setHours(0, 0, 0, 0)

      if (startDateMidnight.getTime() === endDateMidnight.getTime()) {
        // Se è lo stesso giorno
        return `${formatDate(holiday.start)}, ${formatTime(holiday.start)} - ${formatTime(holiday.end)}`
      }

      // Se è su più giorni (raro per un permesso)
      return `${formatDate(holiday.start)} ${formatTime(holiday.start)} - ${formatDate(holiday.end)} ${formatTime(holiday.end)}`
    }
  }

  const handleConfirm = (state: HolidayState) => {
    setViewDialogOpen(false)
    setRejectDialogOpen(false)
    selectedRequest && selectedRequest.id && updateHolidayState(selectedRequest.id, state)
    setTimeout(() => {
      refresh()
    }, 1000)
  }

  return (
    <div className="container mx-auto sm:p-4 space-y-6 sm:space-y-8 py-8 sm:py-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Approvazione Ferie e Permessi</h1>
        <p className="text-sm text-muted-foreground">Gestisci le richieste di ferie e permessi del personale</p>
      </div>
      <div></div>
      <Tabs defaultValue="CONFERMARE" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <TabsList>
            <TabsTrigger value="CONFERMARE">In attesa</TabsTrigger>
            <TabsTrigger value="CONFERMATO">Approvate</TabsTrigger>
            <TabsTrigger value="ANNULLATO">Rifiutate</TabsTrigger>
            <TabsTrigger value="all">Tutte</TabsTrigger>
          </TabsList>
          {user.role !== "ENGINEER" && <Select value={selectedFonico} onValueChange={setSelectedFonico}>
            <SelectTrigger className="w-full sm:w-[140px] text-xs sm:text-sm">
              <SelectValue placeholder="Fonico" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti i fonici</SelectItem>
              {engineers.filter((e) => e.id != 'cm8z06fn00002mytvfftqrkgx').map((en) => {
                return (
                  <SelectItem key={en.id} value={en.id}>
                    {en.username}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>}
        </div>
        <TabsContent value={activeTab} className="mt-6">
          <div className="border rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-white">
                  <TableHead className="font-medium">Dipendente</TableHead>
                  <TableHead className="font-medium">Tipo</TableHead>
                  <TableHead className="font-medium">Periodo</TableHead>
                  <TableHead className="font-medium">Durata</TableHead>
                  <TableHead className="font-medium">Motivazione</TableHead>
                  <TableHead className="font-medium">Stato</TableHead>
                  <TableHead className="font-medium"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      Nessuna richiesta trovata
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => (
                    <TableRow key={request.id} className="border-t">
                      {/*  @ts-ignore */}
                      <TableCell>{request.user.username}</TableCell>
                      <TableCell>
                        {/*  @ts-ignore */}
                        <Badge variant={isVacation(request) ? "destructive" : "warning"}>
                          {isVacation(request) ? "Ferie" : "Permesso"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatPeriod(request)}</TableCell>
                      <TableCell>{formatDuration(request)}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={request.reason}>
                        {request.reason}
                      </TableCell>
                      <TableCell>
                        <Badge
                          //@ts-ignore
                          variant={
                            request.state === "CONFERMATO"
                              ? "success"
                              : request.state === "ANNULLATO"
                                ? "destructive"
                                : "outline"
                          }
                        >
                          {request.state === "CONFERMATO"
                            ? "Approvata"
                            : request.state === "ANNULLATO"
                              ? "Rifiutata"
                              : "In attesa"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            className="rounded-full px-6 py-2 h-auto"
                            onClick={() => handleViewRequest(request)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Visualizza</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog Visualizza Richiesta */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center">Dettagli Richiesta</DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-6 pt-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Dipendente</h3>
                  <div className="bg-gray-100 rounded-md py-3 px-4">
                    {/*  @ts-ignore */}
                    <span>{selectedRequest.user.username}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Tipo di richiesta</h3>
                  <div className="bg-gray-100 rounded-md py-3 px-4">
                    {/*  @ts-ignore */}
                    <Badge variant={isVacation(selectedRequest) ? "destructive" : "warning"}>
                      {isVacation(selectedRequest) ? "Ferie" : "Permesso"}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Periodo</h3>
                  <div className="bg-gray-100 rounded-md py-3 px-4">
                    <span>{formatPeriod(selectedRequest)}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Durata</h3>
                  <div className="bg-gray-100 rounded-md py-3 px-4">
                    <span>{formatDuration(selectedRequest)}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Motivazione</h3>
                  <div className="bg-gray-100 rounded-md py-3 px-4 min-h-[80px]">
                    <span>{selectedRequest.reason}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Stato</h3>
                  <div className="bg-gray-100 rounded-md py-3 px-4">
                    <Badge
                      //@ts-ignore 
                      variant={
                        selectedRequest.state === "CONFERMATO"
                          ? "success"
                          : selectedRequest.state === "ANNULLATO"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {selectedRequest.state === "CONFERMATO"
                        ? "Approvata"
                        : selectedRequest.state === "ANNULLATO"
                          ? "Rifiutata"
                          : "In attesa"}
                    </Badge>
                  </div>
                </div>

                {selectedRequest.state === "CONFERMARE" && user.role !== "ENGINEER" && (
                  <div className=" sticky bottom-0 bg-white  flex gap-4 py-4">
                    <Button
                      variant="outline"
                      className="flex-1 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-500"
                      onClick={() => {
                        setViewDialogOpen(false)
                        setRejectDialogOpen(true)
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Rifiuta
                    </Button>
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleConfirm(HolidayState.CONFERMATO)}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Approva
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Conferma Approvazione */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Conferma Approvazione</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center">
            <p className="text-lg mb-2">Sei sicuro di voler approvare questa richiesta?</p>
            {selectedRequest && (
              <p className="text-sm text-gray-500">
                {/*  @ts-ignore */}
                {selectedRequest.user.username} - {formatPeriod(selectedRequest)}
              </p>
            )}
          </div>
          <DialogFooter className="flex sm:justify-between gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setConfirmDialogOpen(false)}>
              Annulla
            </Button>
            <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleApproveRequest}>
              Conferma
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Conferma Rifiuto */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Conferma Rifiuto</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center">
            <p className="text-lg mb-2">Sei sicuro di voler rifiutare questa richiesta?</p>
            {selectedRequest && (
              <p className="text-sm text-gray-500">
                {/*  @ts-ignore */}
                {selectedRequest.user.username} - {formatPeriod(selectedRequest)}
              </p>
            )}
          </div>
          <DialogFooter className="sticky bottom-0 flex sm:justify-between gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setRejectDialogOpen(false)}>
              Annulla
            </Button>
            <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={() => handleConfirm(HolidayState.ANNULLATO)}>
              Rifiuta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

