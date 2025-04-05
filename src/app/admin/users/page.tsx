"use client"

import { useState, useMemo, useEffect } from "react"
import { Eye, UserCog, Flag, AlertCircle, Search } from "lucide-react"
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
import { useUser } from "@/hooks/useUser"
import type { RoleType } from "@/store/user-store"
import { RadioGroup, RadioGroupItem } from "@/components/RadioGroup"
import { Label } from "@/components/Label"
import { Textarea } from "@/components/TextArea"
import { useReport } from "@/hooks/useReport"
import { Input } from "@/components/Input"

interface User {
  id: string
  username: string
  role: RoleType
}

interface Report {
  id: string
  userId: string
  reason: string
}

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
  const { getAllUsers, updateRole } = useUser()
  const { getAll, createReport, deleteReport } = useReport()

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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return usersState

    return usersState.filter((user) => user.username.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [usersState, searchQuery])

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
  const hasReport = (userId: string) => {
    if (!reports || reports.length === 0) return false
    return reports.some((report) => report && report.userId === userId)
  }

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
    if (!selectedUser || !reportReason.trim()) return

    try {
      console.log(selectedUser)
      const newReport = await createReport({ userId: selectedUser.id, reason: reportReason })

      // Update local state safely
      setReports((prev) => {
        // Handle case where prev might be null or undefined
        const currentReports = prev || []
        return [...currentReports, newReport]
      })

      setReportDialogOpen(false)
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

  return (
    <div className="max-w-6xl mx-auto sm:p-4 md:p-6 py-8 sm:py-12 h-screen overflow-y-auto">
      <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Gestione Utenti</h1>

      {/* Search input */}
      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Cerca utenti..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1) // Reset to first page on search
          }}
          className="pl-10"
        />
      </div>

      {/* Make table responsive */}
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-white">
              <TableHead className="font-medium">Utente</TableHead>
              <TableHead className="font-medium">Ruolo</TableHead>
              <TableHead className="font-medium text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndPaginatedUsers.map((user) => (
              <TableRow key={user.id} className="border-t">
                <TableCell>
                  <div className="flex items-center gap-2">
                    {user.username}
                    {/* @ts-ignore */}
                    {hasReport(user.id) && <AlertCircle className="h-4 w-4 text-red-500" title="Utente segnalato" />}
                  </div>
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
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
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View User Dialog */}
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
              {hasReport(selectedUser.id) && (
                <div>
                  <p className="font-medium text-red-500">Utente Segnalato</p>
                  <p>{getUserReport(selectedUser.id)?.reason}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex sm:justify-between gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setViewDialogOpen(false)}>
              Chiudi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Management Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Gestione Ruolo</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <p>Seleziona il ruolo per {selectedUser.username}:</p>
              {/* @ts-ignore */}
              <RadioGroup value={selectedRole} onValueChange={(value) => setSelectedRole(value as RoleType)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="USER" id="USER" />
                  <Label htmlFor="USER">Utente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ADMIN" id="ADMIN" />
                  <Label htmlFor="ADMIN">Admin</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ENGINEER" id="ENGINEER" />
                  <Label htmlFor="ENGINEER">Fonico</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="SECRETARY" id="SECRETARY" />
                  <Label htmlFor="SECRETARY">Segreteria</Label>
                </div>
              </RadioGroup>
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

      {/* Report User Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {selectedReport ? "Visualizza Segnalazione" : "Segnala Utente"}
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              {selectedReport ? (
                <>
                  <p>Segnalazione esistente per {selectedUser.username}:</p>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-gray-700">{reportReason}</p>
                  </div>
                </>
              ) : (
                <>
                  <p>Inserisci il motivo della segnalazione per {selectedUser.username}:</p>
                  <Textarea
                    placeholder="Motivo della segnalazione..."
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    rows={4}
                  />
                </>
              )}
            </div>
          )}
          <DialogFooter className="flex sm:justify-between gap-2">
            <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
              Annulla
            </Button>
            {selectedReport ? (
              <Button variant="destructive" onClick={handleDeleteReport}>
                Elimina Segnalazione
              </Button>
            ) : (
              <Button onClick={handleSubmitReport}>Invia Segnalazione</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
    </div>
  )
}

