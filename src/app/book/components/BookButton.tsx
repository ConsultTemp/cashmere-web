"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/Dialog"
import { Button } from "@/components/Button"
import { useRouter } from "next/navigation"
import { GoogleSignInButton } from "@/components/GoogleSignInButton"
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth"
import { useUserStore } from "@/store/user-store"
import { useBookingStore } from "@/store/booking-store"
import { useAuth } from "@/hooks/useAuth"
import { Eye, EyeOff } from "lucide-react"
import { DialogTitle } from "@radix-ui/react-dialog"

interface ButtonProps {
  disabled: boolean
}

export function BookButton({ disabled }: ButtonProps) {
  const [view, setView] = useState<"login" | "register">("login")
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const { login, register } = useAuth()
  const router = useRouter()
  const { signInWithGoogle, loading: googleLoading } = useSupabaseAuth()
  const { setUser, user } = useUserStore()
  const { saveBookingToLocalStorage } = useBookingStore()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleButtonClick = () => {
    if (user.id) {
      // Se l'utente è già loggato, vai direttamente alla pagina di conferma
      router.push("/book/confirm")
    } else {
      // Altrimenti, apri il dialog di login
      setDialogOpen(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Salva i dati della prenotazione in localStorage
      saveBookingToLocalStorage()

      let response
      if (view === "login") {
        response = await login(formData)
      } else {
        response = await register(formData)
      }

      if (response?.user.role) {
        setUser({ ...response.user })
        setDialogOpen(false)

        // Vai alla pagina di conferma
        router.push("/book/confirm")
      }
    } catch (error) {
      console.error("Authentication error:", error)
    }
  }

  const handleGoogleSignIn = async () => {
    // Salva i dati della prenotazione in localStorage
    saveBookingToLocalStorage()

    // Imposta un flag per indicare che siamo nel flusso di prenotazione
    localStorage.setItem("bookingInProgress", "true")

    // Esegui il login con Google
    await signInWithGoogle()
    // L'utente verrà reindirizzato a Google per l'autenticazione
  }

  const handleContinueWithoutLogin = () => {
    // Salva i dati della prenotazione in localStorage
    saveBookingToLocalStorage()

    // Vai alla pagina di conferma senza login
    router.push("/book/confirm")
    setDialogOpen(false)
  }

  return (
    <div>
      <Button variant="gradient" onClick={handleButtonClick} disabled={disabled}>
        Continua
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogTitle></DialogTitle>
          <div className="grid gap-6">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                {view === "login" ? "Accedi al tuo account" : "Crea un account"}
              </h1>
              <p className="text-sm text-gray-500">
                {view === "login"
                  ? "Inserisci le tue credenziali per accedere"
                  : "Inserisci i tuoi dati per registrarti"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="username"
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="nome@esempio.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full px-3 py-2 border rounded-md pr-10"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Inserisci la tua password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button type="submit" variant="gradient" color="black" className="w-full">
                {view === "login" ? "Accedi" : "Registrati"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">O continua con</span>
              </div>
            </div>

            <GoogleSignInButton onClick={handleGoogleSignIn} isLoading={googleLoading} />

            <div className="text-center text-sm">
              {view === "login" ? (
                <>
                  Non hai un account?{" "}
                  <button className="text-blue-600 hover:underline" onClick={() => setView("register")}>
                    Registrati
                  </button>
                </>
              ) : (
                <>
                  Hai già un account?{" "}
                  <button className="text-blue-600 hover:underline" onClick={() => setView("login")}>
                    Accedi
                  </button>
                </>
              )}
            </div>

            <div className="text-center">
              <button
                className="text-sm text-gray-500 hover:text-gray-700 underline"
                onClick={handleContinueWithoutLogin}
              >
                Continua senza accedere
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

