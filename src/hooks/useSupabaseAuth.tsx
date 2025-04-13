"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { UserSession, Session, AuthError } from "@/types/auth"
import type { User } from "@supabase/supabase-js"
import { useUserStore } from "@/store/user-store"

export const useSupabaseAuth = () => {
  const [session, setSession] = useState<UserSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)
  const { setUser, clearUser } = useUserStore()

  // Funzione helper per convertire la sessione Supabase nel nostro formato
  const formatSession = (user: User | null, supabaseSession: Session | null): UserSession => ({
    user,
    session: supabaseSession
      ? {
          ...supabaseSession,
          provider_token: supabaseSession.provider_token || undefined,
        }
      : null,
  })

  useEffect(() => {
    let mounted = true

    // Get initial session
    const initSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) throw error

        if (mounted) {
          //@ts-ignore
          setSession(formatSession(session?.user ?? null, session))
          setLoading(false)
        }
      } catch (err: any) {
        console.error("Error getting session:", err)
        if (mounted) {
          setError({
            message: err.message || "Error initializing session",
            status: err.status,
          })
          setLoading(false)
        }
      }
    }

    initSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        //@ts-ignore
        setSession(formatSession(session?.user ?? null, session))

        // Gestisci eventi specifici
        switch (event) {
          case "SIGNED_IN":
            // Salva informazioni aggiuntive dell'utente se necessario
            if (session?.user) {
              try {
                const { error } = await supabase.from("users").upsert({
                  id: session.user.id,
                  email: session.user.email,
                  updated_at: new Date().toISOString(),
                })

                // Controlla se siamo nel flusso di prenotazione
                const isBookingFlow = localStorage.getItem("bookingInProgress") === "true"
                if (isBookingFlow) {
                  // Se siamo nel flusso di prenotazione, reindirizza alla pagina di conferma
                  window.location.href = "/book/confirm"
                }
              } catch (err) {
                console.log("Error updating user data:", err)
              }
            }
            break
          case "SIGNED_OUT":
            // Pulisci lo store utente
            clearUser()
            break
        }

        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [setUser, clearUser])

  const signInWithGoogle = async () => {
    try {
      setError(null)
      setLoading(true)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })

      if (error) throw error
      return data
    } catch (err: any) {
      console.error("Google sign in error:", err)
      setError({
        message: err.message || "Error signing in with Google",
        status: err.status,
      })
      return null
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      setLoading(true)

      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setSession(null)
      // Pulisci lo store utente
      clearUser()

      // Reindirizza alla home usando window.location per un refresh completo
      window.location.href = "/"
    } catch (err: any) {
      console.error("Sign out error:", err)
      setError({
        message: err.message || "Error signing out",
        status: err.status,
      })
    } finally {
      setLoading(false)
    }
  }

  // Aggiungi una funzione per ottenere i dati dell'utente corrente
  const getCurrentUser = () => session?.user || null

  return {
    session,
    user: getCurrentUser(),
    loading,
    error,
    signInWithGoogle,
    signOut,
  }
}

