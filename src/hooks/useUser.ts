"use client"

import { useState } from "react"
import type { ApiError } from "@/types/auth"
import { userApi } from "@/api/user"
import type { RoleType } from "@/store/user-store"
import { authApi } from "@/api/auth"

export const useUser = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const [engineers, setEngineers] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])

  interface LoginRequest {
    username: string
    password: string
    managerId?: string
  }

  const getEngineers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await userApi.getEngineers()

      // Gestisci il caso in cui la risposta è null o undefined
      if (response) {
        setEngineers(response)
        return response
      } else {
        console.error("Risposta API vuota o null")
        setEngineers([])
        return []
      }
    } catch (err) {
      console.error("Errore in getEngineers:", err)
      setError(err as ApiError)
      setEngineers([])
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const getUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await userApi.getUsers()

      // Gestisci il caso in cui la risposta è null o undefined
      if (response) {
        setUsers(response)
        return response
      } else {
        console.error("Risposta API vuota o null")
        setUsers([])
        return []
      }
    } catch (err) {
      setError(err as ApiError)
      setUsers([])
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const getAllUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await userApi.getAllUsers()

      // Gestisci il caso in cui la risposta è null o undefined
      if (response) {
        setUsers(response)
        return response
      } else {
        console.error("Risposta API vuota o null")
        setUsers([])
        return []
      }
    } catch (err) {
      setError(err as ApiError)
      setUsers([])
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const getManagers = async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await userApi.getManagersUsers(id)

      // Gestisci il caso in cui la risposta è null o undefined
      if (response) {
        setUsers(response)
        return response
      } else {
        console.error("Risposta API vuota o null")
        setUsers([])
        return []
      }
    } catch (err) {
      setError(err as ApiError)
      setUsers([])
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const updateRole = async (id: string, role: RoleType) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await userApi.updateRole(id, role)
      return response
    } catch (err) {
      setError(err as ApiError)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const updateEntity = async (id: string, entityId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await userApi.updateEntity(id, entityId)
      return response
    } catch (err) {
      setError(err as ApiError)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const updateUsername = async (id: string, newUsername: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await userApi.updateUsername(id, newUsername)
      return response
    } catch (err) {
      setError(err as ApiError)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const updateNotes = async (id: string, notes: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await userApi.updateNotes(id, notes)
      return response
    } catch (err) {
      setError(err as ApiError)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (credentials: LoginRequest)=> {
    console.log(credentials)
    try {
      setIsLoading(true)
      setError(null)
      const response = await userApi.createUser(credentials)

      return response
    } catch (err) {
      console.error("Registration error:", err)
      setError(err as ApiError)
      return null
    } finally {
      setIsLoading(false)
    }
  }
  
  return {
    engineers,
    getEngineers,
    getUsers,
    updateNotes,
    updateEntity,
    register,
    getAllUsers,
    getManagers,
    updateUsername,
    updateRole,
    isLoading,
    error,
  }
}

