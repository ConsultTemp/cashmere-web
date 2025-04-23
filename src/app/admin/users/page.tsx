"use client"

import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/Command"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/Popover"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/Tabs"
import { Eye, UserCog, Flag, AlertCircle, Pencil, ChevronsUpDown, Check } from "lucide-react"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/Dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationPrevious,
  PaginationNext,
} from "@/components/Pagination"
import { useUser } from "@/hooks/useUser"
import { useUserStore, type RoleType } from "@/store/user-store"
import { Label } from "@/components/Label"
import { Textarea } from "@/components/TextArea"
import { useReport } from "@/hooks/useReport"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/Checkbox"
import { useEffect, useState, useMemo } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/RadioGroup"

interface User {
  id: string
  username: string
  role: RoleType
  notes?: string
}

interface Report {
  id: string
  userId: string
  reason: string
  phone?: string
}

type SortDirection = "asc" | "desc" | null
type SortField = "start" | "created_at" | null

export default function UserManagement() {
  const [usersState, setUsersState] = useState<User[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [roleDialogOpen, setRoleDialogOpen] = useState(false)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<RoleType>("USER")
  const [reportReason, setReportReason] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [notesDialogOpen, setNotesDialogOpen] = useState(false)
  const [newNotes, setNewNotes] = useState("")
  const { getAllUsers, updateRole, updateNotes } = useUser()
  const { setUser } = useUserStore()
  const { getAll, createReport, deleteReport } = useReport()
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [isPhoneReport, setIsPhoneReport] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [activeTab, setActiveTab] = useState("users")
  const [showOnlyReported, setShowOnlyReported] = useState(false)
  const [openUserCombobox, setOpenUserCombobox] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getAllUsers()
        setUsersState(usersData || [])

        try {
          const reportsData = await getAll()
          setReports(reportsData || [])
        } catch (reportError) {
          console.error("Failed to fetch reports:", reportError)
          setReports([])
        }
      } catch (userError) {
        console.error("Failed to fetch users:", userError)
        setUsersState([])
      }
    }

    fetchData()
  }, [])

  const handleUpdateNotes = () => {
    if (selectedUser && selectedUser.id) {
      updateNotes(selectedUser?.id, newNotes ? newNotes : "")
    }
    setNotesDialogOpen(false)
    setTimeout(() => {
      fetchUsers()
    }, 500)
  }
  const hasReport = (userId: string) => {
    if (!reports || reports.length === 0) return false
    return reports.some((report) => report && report.userId === userId)
  }

  const fetchUsers = async () => {
    try {
      const usersData = await getAllUsers()
      setUsersState(usersData || [])

      try {
        const reportsData = await getAll()
        setReports(reportsData || [])
      } catch (reportError) {
        console.error("Failed to fetch reports:", reportError)
        setReports([])
      }
    } catch (userError) {
      console.error("Failed to fetch users:", userError)
      setUsersState([])
    }
  }
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    let filtered = usersState.filter((user) => user.username.toLowerCase().includes(searchQuery.toLowerCase()))

    if (showOnlyReported) {
      filtered = filtered.filter((user) => hasReport(user.id))
    }

    return filtered
  }, [usersState, searchQuery, showOnlyReported])

  // Sorted and paginated users
  const sortedAndPaginatedUsers = useMemo(() => {
    // Calculate indices for pagination
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    // Return paginated users
    return filteredUsers.slice(startIndex, endIndex)
  }, [filteredUsers, currentPage])

  // Calculate total pages
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  // Check if user has a report

  // Get report for a user
  const getUserReport = (userId: string) => {
    if (!reports || reports.length === 0) return null
    return reports.find((report) => report && report.userId === userId) || null
  }

  const handleView = (user: User) => {
    setSelectedUser(user)
    setViewDialogOpen(true)
  }

  const handleRoleManagement = (user: User) => {
    setSelectedUser(user)
    setSelectedRole(user.role)
    setRoleDialogOpen(true)
  }

  const handleReportUser = (user: User) => {
    setSelectedUser(user)
    const report = getUserReport(user.id)

    if (report) {
      setSelectedReport(report)
      setReportReason(report.reason)
    } else {
      setSelectedReport(null)
      setReportReason("")
      setPhoneNumber("")
    }

    setReportDialogOpen(true)
  }

  const handleRoleChange = async () => {
    if (!selectedUser) return

    try {
      await updateRole(selectedUser.id, selectedRole)

      // Update local state
      setUsersState((prevUsers) =>
        prevUsers.map((user) => (user.id === selectedUser.id ? { ...user, role: selectedRole } : user)),
      )

      setRoleDialogOpen(false)
    } catch (error) {
      console.error("Failed to update role:", error)
    }
  }

  const handleSubmitReport = async () => {
    if ((!selectedUser && !phoneNumber) || !reportReason.trim()) return

    try {
      //@ts-ignore
      let newReport
      if (isPhoneReport) {
        //@ts-ignore
        newReport = await createReport({ userId: null, phone: phoneNumber, reason: reportReason })
      } else if (selectedUser) {
        //@ts-ignore
        newReport = await createReport({ userId: selectedUser.id, phone: null, reason: reportReason })
      }

      // Update local state safely
      setReports((prev) => {
        // Handle case where prev might be null or undefined
        const currentReports = prev || []
        //@ts-ignore
        return [...currentReports, newReport]
      })

      setReportDialogOpen(false)
      setPhoneNumber("")
      setSelectedUser(null)
      setReportReason("")
    } catch (error) {
      console.error("Failed to create report:", error)
    }
  }

  const handleDeleteReport = async () => {
    if (!selectedReport) return

    try {
      await deleteReport(selectedReport.id)

      // Update local state safely
      setReports((prev) => {
        // Handle case where prev might be null or undefined
        if (!prev || prev.length === 0) return []
        return prev.filter((report) => report.id !== selectedReport.id)
      })

      setSelectedReport(null)
      setReportReason("")
      setReportDialogOpen(false)
    } catch (error) {
      console.error("Failed to delete report:", error)
    }
  }

  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Show all pages if less than maximum
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Logic to show pages with ellipsis
      if (currentPage <= 3) {
        // Start: show first 3 pages, ellipsis, last page
        for (let i = 1; i <= 3; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push("ellipsis")
        pageNumbers.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // End: show first page, ellipsis, last 3 pages
        pageNumbers.push(1)
        pageNumbers.push("ellipsis")
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push(totalPages)
      } else {
        // Middle: show first page, ellipsis, current page and adjacent, ellipsis, last page
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

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const searchTermLower = searchQuery.toLowerCase()
      const user = usersState.find((u) => u.id === report.userId)
      const username = user ? user.username.toLowerCase() : ""
      const phone = report.phone ? report.phone.toLowerCase() : ""

      return username.includes(searchTermLower) || (report.phone && phone.includes(searchTermLower))
    })
  }, [reports, searchQuery, usersState])

  return (
    <div className="max-w-6xl mx-auto sm:p-4 md:p-6 py-8 sm:py-12">
      <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Gestione Utenti</h1>

      <Tabs defaultValue="users" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="users">Utenti</TabsTrigger>
          <TabsTrigger value="reports">Segnalazioni</TabsTrigger>
        </TabsList>

        {/* Tab Utenti */}
        <TabsContent value="users">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Cerca per nome o entità..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1) // Reset to first page on search
                }}
                className="w-64"
              />
            </div>
            <div className="flex items-center">
              {/* @ts-ignore */}
              <Checkbox id="show-reported" checked={showOnlyReported} onCheckedChange={setShowOnlyReported} />
              <Label htmlFor="show-reported" className="ml-2">
                Mostra solo utenti segnalati
              </Label>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-white">
                  <TableHead className="font-medium">Utente</TableHead>
                  <TableHead className="font-medium">Ruolo</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndPaginatedUsers.map((user) => (
                  <TableRow key={user.id} className="border-t">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {user.username}
                        {/* @ts-ignore */}
                        {hasReport(user.id) && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          className="rounded-full px-2 py-2 h-auto"
                          onClick={() => handleView(user)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Visualizza</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="rounded-full px-2 py-2 h-auto"
                          onClick={() => handleRoleManagement(user)}
                        >
                          <UserCog className="h-4 w-4" />
                          <span className="sr-only">Gestione Ruolo</span>
                        </Button>
                        <Button
                          variant="outline"
                          className={`rounded-full px-2 py-2 h-auto ${hasReport(user.id) ? "bg-red-50" : ""}`}
                          onClick={() => handleReportUser(user)}
                        >
                          <Flag className={`h-4 w-4 ${hasReport(user.id) ? "text-red-500" : ""}`} />
                          <span className="sr-only">Segnala Utente</span>
                        </Button>
                        <Button
                          variant="outline"
                          className={`rounded-full px-2 py-2 h-auto ${hasReport(user.id) ? "bg-red-50" : ""}`}
                          onClick={() => {
                            setNewNotes(user.notes ? user.notes : "")
                            setNotesDialogOpen(true)
                            setSelectedUser(user)
                          }}
                        >
                          <Pencil className={`h-4 w-4`} />
                          <span className="sr-only">Segnala Utente</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4">
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
        </TabsContent>

        {/* Tab Segnalazioni */}
        <TabsContent value="reports">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Cerca per nome utente o numero di telefono..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
            </div>
            <Button variant="outline" onClick={() => setReportDialogOpen(true)}>
              Crea Segnalazione
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-white">
                  <TableHead className="font-medium">Utente</TableHead>
                  <TableHead className="font-medium">Telefono</TableHead>
                  <TableHead className="font-medium">Motivo</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id} className="border-t">
                    <TableCell>
                      {report.userId
                        ? usersState.find((u) => u.id === report.userId)?.username || "Utente non trovato"
                        : "N/A"}
                    </TableCell>
                    <TableCell>{report.phone || "N/A"}</TableCell>
                    <TableCell>{report.reason}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        className="rounded-full px-2 py-2 h-auto"
                        onClick={() => {
                          setSelectedReport(report)
                          setReportReason(report.reason)
                          setReportDialogOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Visualizza</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Report User Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="w-3/4">
          <DialogHeader>
            <DialogTitle className="text-center">
              {selectedReport ? "Visualizza Segnalazione" : "Segnala Utente"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 w-3/4">
            <div className="flex items-center space-x-2">
              {/* @ts-ignore */}
              <Checkbox id="phone-report" checked={isPhoneReport} onCheckedChange={setIsPhoneReport} />
              <Label htmlFor="phone-report">Segnala numero di telefono</Label>
            </div>

            {isPhoneReport ? (
              <div>
                <label className="block text-sm font-medium text-gray-700">Numero di telefono</label>
                <Input
                  type="tel"
                  placeholder="Inserisci numero di telefono"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            ) : (
              <div className="overflow-hidden">
                <label className="block text-sm font-medium text-gray-700">Utente</label>
                <Popover open={openUserCombobox} onOpenChange={setOpenUserCombobox}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openUserCombobox}
                      className="w-full justify-between"
                    >
                      {selectedUser
                        ? usersState.find((user) => user.id === selectedUser.id)?.username
                        : "Seleziona utente"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Cerca utente..." />
                      <CommandList>
                        <CommandEmpty>Nessun utente trovato.</CommandEmpty>
                        <CommandGroup>
                          {usersState.map((user) => (
                            <CommandItem
                              key={user.id}
                              value={user.username}
                              onSelect={() => {
                                setSelectedUser(user)
                                setOpenUserCombobox(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedUser?.id === user.id ? "opacity-100" : "opacity-0",
                                )}
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
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Motivo della segnalazione</label>
              <Textarea
                placeholder="Motivo della segnalazione..."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter className="w-full flex flex-row  flex-wrap justify-left gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setReportDialogOpen(false)
                setReportReason("")
                setPhoneNumber("")
                setSelectedUser(null)
                setIsPhoneReport(false)
                setSelectedReport(null)
              }}
              className="px-2 py-1"
            >
              Annulla
            </Button>
            {selectedReport && (
              <Button variant="destructive" className="px-2 py-1" onClick={handleDeleteReport}>
                Elimina Segnalazione
              </Button>
            )}
            <Button className="px-2 py-1" onClick={handleSubmitReport}>Invia Segnalazione</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notes User Dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Modifica note</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <>
                <p>Inserisci note per {selectedUser.username}:</p>
                <Textarea
                  placeholder="Note..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={4}
                  className="h-24"
                />
              </>
            </div>
          )}
          <DialogFooter className="flex sm:justify-between gap-2">
            <Button variant="outline" onClick={() => setNotesDialogOpen(false)}>
              Annulla
            </Button>
            <Button variant="gradient" onClick={handleUpdateNotes}>
              Salva
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center">Dettagli Utente</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <p className="font-medium">Username:</p>
                <p>{selectedUser.username}</p>
              </div>
              <div>
                <p className="font-medium">Ruolo:</p>
                <p>{selectedUser.role}</p>
              </div>
              <div>
                <p className="font-medium">Note:</p>
                <p>{selectedUser.notes}</p>
              </div>
              {hasReport(selectedUser.id) && (
                <div>
                  <p className="font-medium text-red-500">Utente Segnalato</p>
                  <p>{getUserReport(selectedUser.id)?.reason}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Gestione Ruolo</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <p>Seleziona il ruolo per {selectedUser.username}:</p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="USER"
                    name="role"
                    value="USER"
                    checked={selectedRole === "USER"}
                    onChange={() => setSelectedRole("USER")}
                    className="h-4 w-4"
                  />
                  <label htmlFor="USER" className="text-sm">Utente</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="ADMIN"
                    name="role"
                    value="ADMIN"
                    checked={selectedRole === "ADMIN"}
                    onChange={() => setSelectedRole("ADMIN")}
                    className="h-4 w-4"
                  />
                  <label htmlFor="ADMIN" className="text-sm">Admin</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="MANAGER"
                    name="role"
                    value="MANAGER"
                    checked={selectedRole === "MANAGER"}
                    onChange={() => setSelectedRole("MANAGER")}
                    className="h-4 w-4"
                  />
                  <label htmlFor="ADMIN" className="text-sm">Admin</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="ENGINEER"
                    name="role"
                    value="ENGINEER"
                    checked={selectedRole === "ENGINEER"}
                    onChange={() => setSelectedRole("ENGINEER")}
                    className="h-4 w-4"
                  />
                  <label htmlFor="ENGINEER" className="text-sm">Fonico</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="SECRETARY"
                    name="role"
                    value="SECRETARY"
                    checked={selectedRole === "SECRETARY"}
                    onChange={() => setSelectedRole("SECRETARY")}
                    className="h-4 w-4"
                  />
                  <label htmlFor="SECRETARY" className="text-sm">Segreteria</label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex sm:justify-between gap-2">
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
              Annulla
            </Button>
            <Button onClick={handleRoleChange}>Conferma</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
