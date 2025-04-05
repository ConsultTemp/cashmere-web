"use client"

import { useState } from "react"
import { authApi } from "@/api/auth"
import type { LoginRequest, LoginResponse, ApiError, GooGleLoginDTO } from "@/types/auth"
import { useUserStore } from "@/store/user-store"

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const { setUser } = useUserStore()

  const login = async (credentials: LoginRequest): Promise<LoginResponse | null> => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await authApi.login(credentials)

      if (response?.user.role) {
        // Salva l'utente nello store
        setUser(response.user)
      }

      return response
    } catch (err) {
      console.log("Login error:", err)
      setError(err as ApiError)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (credentials: LoginRequest): Promise<LoginResponse | null> => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await authApi.register(credentials)

      if (response?.user.role) {
        // Salva l'utente nello store
        setUser(response.user)
      }

      return response
    } catch (err) {
      console.error("Registration error:", err)
      setError(err as ApiError)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const googleLogin = async (data: GooGleLoginDTO): Promise<LoginResponse | null> => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await authApi.googleLogin(data)

      if (response?.user) {
        // Salva l'utente nello store
        setUser(response.user)
      }

      return response
    } catch (err) {
      console.error("Google login error:", err)
      setError(err as ApiError)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    login,
    googleLogin,
    register,
    isLoading,
    error,
  }
}

