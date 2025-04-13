"use client"

import { useState, useEffect } from "react"
import { type RoleType, useUserStore } from "@/store/user-store"
import type React from "react"
import { Menu, Home, Calendar, CheckCircle, Phone, Sun, Music2, User, Clock } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import Image from "next/image"
import logo from "../../../public/cashmere-color.svg"
import { Button } from "@/components/Button"
import { useRouter } from "next/navigation"

interface SidebarItem {
  icon: React.ReactNode
  label: string
  href: string
  roles: RoleType[]
}

const sidebarItems: SidebarItem[] = [
  {
    icon: <Home className="min-w-4 h-4" />,
    label: "Home",
    href: "/admin/home",
    roles: ["ENGINEER"],
  },
  {
    icon: <Clock className="min-w-4 h-4" />,
    label: "Situazione",
    href: "/admin/current",
    roles: ["ADMIN", "SECRETARY"],
  },
  {
    icon: <Calendar className="min-w-4 h-4" />,
    label: "Calendario",
    href: "/admin/calendar",
    roles: ["ADMIN", "ENGINEER", "SECRETARY"],
  },
  {
    icon: <CheckCircle className="min-w-4 h-4" />,
    label: "Conferma prenotazioni",
    href: "/admin/confirm",
    roles: ["ADMIN", "SECRETARY"],
  },
  {
    icon: <Phone className="min-w-4 h-4" />,
    label: "Fonici",
    href: "/admin/availability",
    roles: ["ADMIN", "ENGINEER", "SECRETARY"],
  },
  {
    icon: <Sun className="min-w-4 h-4" />,
    label: "Ferie e permessi",
    href: "/admin/holidays",
    roles: ["ADMIN", "SECRETARY", "ENGINEER"],
  },
  {
    icon: <Music2 className="min-w-4 h-4" />,
    label: "Entità",
    href: "/admin/entities",
    roles: ["ADMIN", "SECRETARY"],
  },
  {
    icon: <User className="min-w-4 h-4" />,
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
  const { user, clearUser } = useUserStore()
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

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
          <div className={`flex flex-col items-${isCollapsed ? 'center' : 'start'} justify-between mb-8`}>
            <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8">
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          <nav className={`flex-1 flex flex-col items-${isCollapsed ? 'center' : 'start'}`}>
            <Image src={logo || "/placeholder.svg"} width={30} height={30} alt="Cashmere logo" className="mb-8" />
            {sidebarItems
              .filter((s) => s.roles.includes(user.role))
              .map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsCollapsed(true)}
                  className={cn(
                    "flex items-center gap-3 py-4 rounded-lg mb-1 hover:bg-gray-100 transition-colors w-full",
                    "text-gray-700 hover:text-black",
                    isCollapsed ? "flex-col" : "px-4",
                  )}
                >
                  {item.icon}
                  {!isCollapsed && <span className="text-sm font-light">{item.label}</span>}
                </Link>
              ))}
          </nav>

          {!isCollapsed && (
            <div className="border-t pt-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{user.username}</p>
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
                    <p className="text-xs text-blue-600 underline cursor-pointer" onClick={handleLogout}>
                      Logout
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content - non ha più il margine condizionale */}
      <div className="w-full p-4 pl-16 md:pl-20 pb-16">{children}</div>
    </div>
  )
}

