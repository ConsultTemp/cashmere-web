"use client"

import { useState, useEffect } from "react"
import { type RoleType, useUserStore } from "@/store/user-store"
import type React from "react"
import {
  Menu,
  HomeIcon as House,
  CopyCheck,
  CalendarDays,
  BookHeadphones,
  Users,
  Briefcase,
  UserCog,
  Pencil,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import Image from "next/image"
import logo from "../../../public/cashmere-logo.svg"
import { Button } from "@/components/Button"
import { usePathname, useRouter } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/Dialog"
import { Input } from "@/components/Input"
import { useUser } from "@/hooks/useUser"

interface SidebarItem {
  icon: React.ReactNode
  label: string
  href: string
  roles: RoleType[]
}

const sidebarItems: SidebarItem[] = [
  {
    icon: <House className="min-w-5 h-5" />,
    label: "Home",
    href: "/admin/home",
    roles: ["ENGINEER"],
  },
  {
    icon: <House className="min-w-5 h-5" />,
    label: "Situazione",
    href: "/admin/current",
    roles: ["ADMIN", "SECRETARY"],
  },
  {
    icon: <CalendarDays className="min-w-5 h-5" />,
    label: "Calendario",
    href: "/admin/calendar",
    roles: ["ADMIN", "ENGINEER", "SECRETARY"],
  },
  {
    icon: <CopyCheck className="min-w-5 h-5" />,
    label: "Conferma",
    href: "/admin/confirm",
    roles: ["ADMIN", "SECRETARY"],
  },
  {
    icon: <Users className="min-w-5 h-5" />,
    label: "Fonici",
    href: "/admin/availability",
    roles: ["ADMIN", "ENGINEER", "SECRETARY"],
  },
  {
    icon: <Briefcase className="min-w-5 h-5" />,
    label: "Ferie",
    href: "/admin/holidays",
    roles: ["ADMIN", "SECRETARY", "ENGINEER"],
  },
  {
    icon: <BookHeadphones className="min-w-5 h-5" />,
    label: "Entità",
    href: "/admin/entities",
    roles: ["ADMIN", "SECRETARY"],
  },
  {
    icon: <UserCog className="min-w-5 h-5" />,
    label: "Utenti",
    href: "/admin/users",
    roles: ["ADMIN", "SECRETARY"],
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const { user, clearUser, setUser } = useUserStore()
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const [error, setError ] = useState(false)
  // Aggiungi questi stati per il dialog di cambio nome utente
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newUsername, setNewUsername] = useState("")
  const {updateUsername} = useUser()
  const pathname = usePathname()

  console.log(user)

  useEffect(() => {
    // Semplice verifica che ci sia un utente, senza reindirizzamenti
    setIsLoading(false)
  }, [user])

  const handleLogout = () => {
    // Esegui il logout dallo store
    clearUser()

    // Reindirizza alla home page
    router.push("/")
  }

  const closeSidebar = () => {
    setIsCollapsed(true)
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

  if (isLoading) {
    return (
      <div className="h-screen overflow-y-auto flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Se non c'è un utente o non ha il ruolo corretto, mostriamo un messaggio invece di reindirizzare
  const isAuthorized = user.id && (user.role === "ADMIN" || user.role === "SECRETARY" || user.role === "ENGINEER")

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <h1 className="text-2xl font-bold mb-4">Accesso non autorizzato</h1>
        <p className="mb-4">Non hai i permessi necessari per accedere a questa area.</p>
        <a href="/" className="text-blue-500 hover:underline">
          Torna alla home
        </a>
      </div>
    )
  }

  return (
    <div className="">
      {/* Overlay che appare quando la sidebar è aperta */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "h-screen fixed left-0 top-0 z-40 bg-white border-r transition-all duration-300 pb-8 md:pb-0",
          isCollapsed ? "w-12 md:w-16" : "w-64",
        )}
      >
        <div className="flex flex-col h-full p-2">
          <div className={`flex flex-col items-${isCollapsed ? "center" : " px-4 start"} justify-between mb-8`}>
            <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8">
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          <nav className={`flex-1 flex flex-col items-${isCollapsed ? "center" : "start"}`}>
            <Image
              src={logo || "/placeholder.svg"}
              width={30}
              height={30}
              alt="Cashmere logo"
              className={`mb-8 ${isCollapsed ? "" : "ml-4"}`}
            />
            {sidebarItems
              .filter((s) => s.roles.includes(user.role))
              .map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsCollapsed(true)}
                  className={cn(
                    "flex items-center gap-3 py-4 rounded-lg mb-1 transition-colors w-full",
                    "text-gray-700 hover:text-black",
                    isCollapsed ? "flex-col" : "px-4",
                    pathname === item.href ? "bg-gray-100" : ""
                  )}
                >
                  {item.icon}
                  {!isCollapsed && <span className="text-sm font-light">{item.label}</span>}
                </Link>
              ))}
          </nav>

          {!isCollapsed && (
            <div className="pt-4 pl-4">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex-1">
                  {/* Modifica qui per aggiungere il popover */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="text-xs font-medium hover:underline cursor-pointer flex flex-row items-center gap-2" onClick={() => setNewUsername(user.username)}>{user.username}<Pencil className="w-3 h-3"/></button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56">
                      <div className="space-y-2">
                        <h4 className="font-medium">Il tuo account</h4>
                        <Button
                          variant="outline"
                          color="black"
                          className="w-full justify-start"
                          onClick={() => setIsDialogOpen(true)}
                        >
                          Cambia nome utente
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <div className="flex flex-row justify-between">
                    <p className="text-xs text-gray-500">
                      Ruolo: {(() => {
                        switch (user.role) {
                          case "ENGINEER":
                            return "Fonico"
                          case "ADMIN":
                            return "Admin"
                          case "SECRETARY":
                            return "Segreteria"
                          default:
                            return "Sconosciuto"
                        }
                      })()}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-red-500 mb-4 cursor-pointer" onClick={handleLogout}>
                Esci
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main content - non ha più il margine condizionale */}
      <div className="w-full p-4 pl-16 md:pl-20 pb-16">{children}</div>

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
