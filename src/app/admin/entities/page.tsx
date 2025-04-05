"use client"

import { useState, useEffect } from "react"
import { Search, X, CalendarIcon, ChevronsUpDown, Check, RefreshCw } from "lucide-react"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Dialog"
import { Textarea } from "@/components/TextArea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/Accordion"
import { useEntity } from "@/hooks/useEntity"
import { useUser } from "@/hooks/useUser"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/Command"
import { Calendar } from "@/components/Calendar"
import { format } from "date-fns"
import { it } from "date-fns/locale"
import { cn } from "@/lib/utils"

// Data types
interface User {
  id: string
  username: string
  entityId?: string
  notes?: string
}

interface Entity {
  id: string
  name: string
}

interface InvoiceData {
  fonicoName: string
  totHours: number
}

export default function RosterManagementPage() {
  // Modal states
  const [addArtistOpen, setAddArtistOpen] = useState(false)
  const [addEntityOpen, setAddEntityOpen] = useState(false)
  const [editArtistOpen, setEditArtistOpen] = useState(false)
  const [selectedArtist, setSelectedArtist] = useState<User | null>(null)
  const [newEntityName, setNewEntityName] = useState<string>("")
  const [entities, setEntities] = useState<Entity[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  // Combobox states
  const [openUserCombobox, setOpenUserCombobox] = useState(false)
  const [openEntityCombobox, setOpenEntityCombobox] = useState(false)
  const [selectedUser, setSelectedUser] = useState<string>("")
  const [selectedEntity, setSelectedEntity] = useState<string>("")
  const [artistNotes, setArtistNotes] = useState<string>("")

  // Billing calculation states
  const [billingEntityOpen, setBillingEntityOpen] = useState(false)
  const [billingArtistOpen, setBillingArtistOpen] = useState(false)
  const [billingEntity, setBillingEntity] = useState<string>("")
  const [billingArtist, setBillingArtist] = useState<string>("")
  const [fromDate, setFromDate] = useState<Date>()
  const [toDate, setToDate] = useState<Date>()
  const [fromCalendarOpen, setFromCalendarOpen] = useState(false)
  const [toCalendarOpen, setToCalendarOpen] = useState(false)
  const [invoiceData, setInvoiceData] = useState<InvoiceData[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Hooks
  const { getAll, createEntity, getInvoices } = useEntity()
  const { getUsers, updateEntity } = useUser()

  // Fetch entities and users
  useEffect(() => {
    const fetchEntities = async () => {
      const fetchedEntities = await getAll()
      setEntities(fetchedEntities)
    }

    const fetchUsers = async () => {
      const fetchedUsers = await getUsers()
      setUsers(fetchedUsers)
    }

    fetchEntities()
    fetchUsers()
  }, [])

  // Fetch invoice data when filters change
  useEffect(() => {
    const fetchInvoiceData = async () => {
      if (!billingEntity && !billingArtist) {
        setInvoiceData([])
        return
      }

      setIsLoading(true)
      try {
        const id = billingEntity || billingArtist
        const query: any = {}

        if (fromDate) {
          query.startDate = fromDate.toISOString()
        }

        if (toDate) {
          query.endDate = toDate.toISOString()
        }

        const data = await getInvoices(id, query)
        setInvoiceData(data)
      } catch (error) {
        console.error("Error fetching invoice data:", error)
        setInvoiceData([])
      } finally {
        setIsLoading(false)
      }
    }

    if (billingEntity || billingArtist) {
      fetchInvoiceData()
    }
  }, [billingEntity, billingArtist, fromDate, toDate])

  // Reset billing filters
  const resetBillingFilters = () => {
    setBillingEntity("")
    setBillingArtist("")
    setFromDate(undefined)
    setToDate(undefined)
    setInvoiceData([])
  }

  const refresh = () => {
    const fetchEntities = async () => {
      const fetchedEntities = await getAll()
      setEntities(fetchedEntities)
    }

    const fetchUsers = async () => {
      const fetchedUsers = await getUsers()
      setUsers(fetchedUsers)
    }

    fetchEntities()
    fetchUsers()
  }

  // Create new entity
  const handleCreateEntity = () => {
    createEntity({
      name: newEntityName,
    })
    setAddEntityOpen(false)
    setNewEntityName("")
    setTimeout(() => {
      refresh()
    }, 1000)
  }

  // Open add artist modal
  const openAddArtist = () => {
    setSelectedUser("")
    setSelectedEntity("")
    setArtistNotes("")
    setAddArtistOpen(true)
  }

  // Open edit artist modal
  const openEditArtist = (artist: User) => {
    setSelectedArtist(artist)
    setSelectedUser(artist.id)
    setSelectedEntity(artist.entityId || "")
    setArtistNotes(artist.notes || "")
    setEditArtistOpen(true)
  }

  // Filter entities and artists based on search term
  const filteredEntities = entities.filter((entity) => entity.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Get artists for an entity
  const getArtistsForEntity = (entityId: string) => {
    return users.filter((user) => user.entityId === entityId)
  }

  // Get filtered artists for billing combobox
  const getFilteredArtistsForBilling = () => {
    if (billingEntity) {
      return users.filter((user) => user.entityId === billingEntity)
    }
    return users
  }

  const assignUser = (userId: string, entityId: string) => {
    setAddArtistOpen(false)
    setEditArtistOpen(false)
    updateEntity(userId, entityId)
    setTimeout(() => {
      refresh()
    }, 1000)
  }

  // Calculate total hours from invoice data
  const totalInvoiceHours = invoiceData.reduce((acc, curr) => acc + curr.totHours, 0)

  return (
    <div className="p-2 sm:p-4 md:p-6">
      {/* Entities & Artists Section */}
      <div className="mb-8 sm:mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">Entità & artisti</h2>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="rounded-full bg-white text-black border-gray-300"
              onClick={() => setAddEntityOpen(true)}
            >
              Aggiungi entità
            </Button>
            <Button className="rounded-full bg-black text-white" onClick={openAddArtist}>
              Aggiungi artista
            </Button>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            className="pl-10 bg-gray-100 border-none"
            placeholder="Cerca"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Accordion type="multiple" defaultValue={["item-1"]} className="border-none">
          {filteredEntities.map((entity) => (
            <AccordionItem key={entity.id} value={`item-${entity.id}`} className="border-b py-2">
              <AccordionTrigger className="hover:no-underline py-2">
                <span className="font-medium">{entity.name}</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2 mt-2">
                  {getArtistsForEntity(entity.id).map((artist) => (
                    <div
                      key={artist.id}
                      className="bg-gray-100 rounded-full px-4 py-2 text-sm cursor-pointer"
                      onClick={() => openEditArtist(artist)}
                    >
                      {artist.username}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Billing Calculation Section */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold">Calcolo fatturazione</h2>
          <Button variant="outline" className="flex items-center gap-2" onClick={resetBillingFilters}>
            <RefreshCw className="h-4 w-4" />
            Resetta filtri
          </Button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Seleziona entità</p>
          <Popover open={billingEntityOpen} onOpenChange={setBillingEntityOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={billingEntityOpen}
                className="w-full justify-between bg-white"
              >
                {billingEntity ? entities.find((entity) => entity.id === billingEntity)?.name : "Seleziona entità"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Cerca entità..." />
                <CommandList>
                  <CommandEmpty>Nessuna entità trovata.</CommandEmpty>
                  <CommandGroup>
                    {entities.map((entity) => (
                      <CommandItem
                        key={entity.id}
                        value={entity.name}
                        onSelect={() => {
                          setBillingEntity(entity.id)
                          setBillingEntityOpen(false)
                          // Reset artist selection when entity changes
                          setBillingArtist("")
                        }}
                      >
                        <Check
                          className={cn("mr-2 h-4 w-4", billingEntity === entity.id ? "opacity-100" : "opacity-0")}
                        />
                        {entity.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Seleziona artista</p>
          <Popover open={billingArtistOpen} onOpenChange={setBillingArtistOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={billingArtistOpen}
                className="w-full justify-between bg-white"
              >
                {billingArtist ? users.find((user) => user.id === billingArtist)?.username : "Seleziona artista"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Cerca artista..." />
                <CommandList>
                  <CommandEmpty>Nessun artista trovato.</CommandEmpty>
                  <CommandGroup>
                    {getFilteredArtistsForBilling().map((user) => (
                      <CommandItem
                        key={user.id}
                        value={user.username}
                        onSelect={() => {
                          setBillingArtist(user.id)
                          setBillingArtistOpen(false)
                        }}
                      >
                        <Check
                          className={cn("mr-2 h-4 w-4", billingArtist === user.id ? "opacity-100" : "opacity-0")}
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

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="w-full sm:w-1/2">
            <p className="text-sm text-gray-600 mb-1">Da</p>
            <Popover open={fromCalendarOpen} onOpenChange={setFromCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-white">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? format(fromDate, "PPP", { locale: it }) : "Seleziona data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={(date) => {
                    setFromDate(date)
                    setFromCalendarOpen(false)
                  }}
                  initialFocus
                  locale={it}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="w-full sm:w-1/2">
            <p className="text-sm text-gray-600 mb-1">A</p>
            <Popover open={toCalendarOpen} onOpenChange={setToCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-white">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? format(toDate, "PPP", { locale: it }) : "Seleziona data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={(date) => {
                    setToDate(date)
                    setToCalendarOpen(false)
                  }}
                  initialFocus
                  locale={it}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <h3 className="font-medium mb-3">Totale ore</h3>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : invoiceData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {invoiceData.map((item, index) => {
              // Assign a color based on the index
              const colors = [
                "text-pink-500",
                "text-red-500",
                "text-purple-500",
                "text-blue-500",
                "text-green-500",
                "text-orange-500",
              ]
              const color = colors[index % colors.length]

              return (
                <div key={index} className="bg-white rounded-lg p-4 border">
                  <p className={`${color} font-medium`}>{item.fonicoName}</p>
                  <p className="text-2xl font-bold">{Math.round(item.totHours * 10) / 10} ore</p>
                </div>
              )
            })}
            <div className="bg-black rounded-lg p-4 text-white">
              <p className="font-medium">Totale</p>
              <p className="text-2xl font-bold">{Math.round(totalInvoiceHours * 10) / 10} ore</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {billingEntity || billingArtist
              ? "Nessun dato disponibile per i filtri selezionati"
              : "Seleziona un'entità o un artista per visualizzare i dati"}
          </div>
        )}
      </div>

      {/* Add Artist Modal */}
      <Dialog open={addArtistOpen} onOpenChange={setAddArtistOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-medium">Aggiungi artista</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => setAddArtistOpen(false)} className="h-8 w-8">
              <X size={24} />
            </Button>
          </DialogHeader>
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <label className="text-lg font-medium mb-2 block">Artista</label>
                <Popover open={openUserCombobox} onOpenChange={setOpenUserCombobox}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openUserCombobox}
                      className="w-full justify-between"
                    >
                      {selectedUser ? users.find((user) => user.id === selectedUser)?.username : "Seleziona artista"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Cerca artista..." />
                      <CommandList>
                        <CommandEmpty>Nessun artista trovato.</CommandEmpty>
                        <CommandGroup>
                          {users.map((user) => (
                            <CommandItem
                              key={user.id}
                              value={user.username}
                              onSelect={() => {
                                setSelectedUser(user.id)
                                setOpenUserCombobox(false)
                              }}
                            >
                              <Check
                                className={cn("mr-2 h-4 w-4", selectedUser === user.id ? "opacity-100" : "opacity-0")}
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

              <div>
                <label className="text-lg font-medium mb-2 block">Entità</label>
                <Popover open={openEntityCombobox} onOpenChange={setOpenEntityCombobox}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openEntityCombobox}
                      className="w-full justify-between"
                    >
                      {selectedEntity
                        ? entities.find((entity) => entity.id === selectedEntity)?.name
                        : "Seleziona entità"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Cerca entità..." />
                      <CommandList>
                        <CommandEmpty>Nessuna entità trovata.</CommandEmpty>
                        <CommandGroup>
                          {entities.map((entity) => (
                            <CommandItem
                              key={entity.id}
                              value={entity.name}
                              onSelect={() => {
                                setSelectedEntity(entity.id)
                                setOpenEntityCombobox(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedEntity === entity.id ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {entity.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-lg font-medium mb-2 block">Note</label>
                <Textarea
                  placeholder="Note"
                  value={artistNotes}
                  onChange={(e) => setArtistNotes(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
            </div>
          </div>
          <div className="border-t p-4 flex justify-between">
            <Button variant="ghost" onClick={() => setAddArtistOpen(false)} className="text-lg font-medium">
              Annulla
            </Button>
            <Button
              className="bg-black text-white text-lg font-medium px-8 rounded-md"
              onClick={() => {
                assignUser(selectedUser, selectedEntity)
              }}
            >
              Conferma
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Artist Modal */}
      <Dialog open={editArtistOpen} onOpenChange={setEditArtistOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-medium">{selectedArtist?.username || ""}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => setEditArtistOpen(false)} className="h-8 w-8">
              <X size={24} />
            </Button>
          </DialogHeader>
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <label className="text-lg font-medium mb-2 block">Nome artista</label>
                <Input
                  placeholder="Artista"
                  value={selectedArtist?.username || ""}
                  disabled={true}
                  className="bg-gray-100"
                />
              </div>

              <div>
                <label className="text-lg font-medium mb-2 block">Entità</label>
                <Popover open={openEntityCombobox} onOpenChange={setOpenEntityCombobox}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openEntityCombobox}
                      className="w-full justify-between"
                    >
                      {selectedEntity
                        ? entities.find((entity) => entity.id === selectedEntity)?.name
                        : "Seleziona entità"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Cerca entità..." />
                      <CommandList>
                        <CommandEmpty>Nessuna entità trovata.</CommandEmpty>
                        <CommandGroup>
                          {entities.map((entity) => (
                            <CommandItem
                              key={entity.id}
                              value={entity.name}
                              onSelect={() => {
                                setSelectedEntity(entity.id)
                                setOpenEntityCombobox(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedEntity === entity.id ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {entity.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-lg font-medium mb-2 block">Note</label>
                <Textarea
                  placeholder="Note"
                  value={artistNotes}
                  onChange={(e) => setArtistNotes(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
            </div>
          </div>
          <div className="border-t p-4 flex justify-between">
            <Button variant="ghost" onClick={() => setEditArtistOpen(false)} className="text-lg font-medium">
              Annulla
            </Button>
            <Button
              className="bg-black text-white text-lg font-medium px-8 rounded-md"
              onClick={() => {
                assignUser(selectedUser, selectedEntity)
              }}
            >
              Conferma
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Entity Modal */}
      <Dialog open={addEntityOpen} onOpenChange={setAddEntityOpen}>
        <DialogContent className="w-[95vw] sm:max-w-md mx-auto">
          <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-medium">Aggiungi entità</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => setAddEntityOpen(false)} className="h-8 w-8">
              <X size={24} />
            </Button>
          </DialogHeader>

          <div className="p-6">
            <div className="space-y-6">
              <div>
                <label className="text-lg font-medium mb-2 block">Nome entità</label>
                <Input
                  placeholder="Nome entità"
                  value={newEntityName}
                  onChange={(e) => setNewEntityName(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="border-t p-4 flex justify-between">
            <Button variant="ghost" onClick={() => setAddEntityOpen(false)} className="text-lg font-medium">
              Annulla
            </Button>
            <Button className="bg-black text-white text-lg font-medium px-8 rounded-md" onClick={handleCreateEntity}>
              Conferma
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

