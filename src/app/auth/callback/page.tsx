"use client"

import { useEffect, useState } from "react"
import { useAuthCallback } from "@/hooks/useAuthCallback"
import { useUserStore } from "@/store/user-store"

export default function AuthCallbackPage() {
    const { processAuthCallback } = useAuthCallback()
    const { setUser } = useUserStore()
    const [error, setError] = useState<string | null>(null)
    const [processing, setProcessing] = useState(true)

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const { user } = await processAuthCallback()

                if (user) {
                    setUser(user)
                } else {
                    setError("No user data returned from authentication")
                    return
                }

                // Controlla se siamo nel flusso di prenotazione
                const isBookingFlow = localStorage.getItem("bookingInProgress") === "true"

                // Reindirizza usando window.location per un refresh completo
                if (isBookingFlow) {
                    window.location.href = "/book/confirm"
                } else {
                    console.log("hello")
                    let path
                    switch (user.role) {
                        case "ADMIN":
                            path = "/admin/confirm"
                            break
                        case "ENGINEER":
                            path = "/admin/availability"
                            break
                        case "SECRETARY":
                            path = "/admin/users"
                            break
                        case "USER":
                            path = "/dashboard"
                            break
                        default:
                            path = "/"
                            break
                    }
                    console.log("passes")
                    setProcessing(false)
                    window.location.href = path
                }
                console.log(user)
            } catch (error) {
                console.error("Callback error:", error)
                setError("Authentication failed. Please try again.")
                setProcessing(false)
            }
        }

        handleCallback()
    }, [])

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col">
                <div className="text-red-500 mb-4">{error}</div>
                <a href="/" className="px-4 py-2 bg-blue-500 text-white rounded">
                    Torna alla home
                </a>
            </div>
        )
    }

    if (processing) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    return null
}

