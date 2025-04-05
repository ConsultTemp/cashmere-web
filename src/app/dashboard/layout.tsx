"use client"

import { useEffect, useState } from "react"
import { useUserStore } from "@/store/user-store"
import type React from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useUserStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Semplice verifica che ci sia un utente, senza reindirizzamenti
    setIsLoading(false)
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Se non c'è un utente, mostriamo un messaggio invece di reindirizzare
  if (!user.id) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <h1 className="text-2xl font-bold mb-4">Accesso richiesto</h1>
        <p className="mb-4">Devi effettuare l'accesso per visualizzare questa pagina.</p>
        <a href="/" className="text-blue-500 hover:underline">
          Torna alla home
        </a>
      </div>
    )
  }

  return <>{children}</>
}

