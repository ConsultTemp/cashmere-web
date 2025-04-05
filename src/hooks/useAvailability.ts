"use client"

import { useState } from "react"
import type { ApiError } from "@/types/auth"
import type { CreateAvailabilityDto } from "@/types/types"
import { availabilityApi } from "@/api/availability"

export function useAvailability() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const getEngineerAvailability = async (engineerId: string, date: Date) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await availabilityApi.getEngineerAvailability(engineerId, date)
      return response
    } catch (err) {
      setError(err as ApiError)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const getWeeklyAvailability = async (engineerId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await availabilityApi.getWeeklyAvailability(engineerId)
      return response
    } catch (err) {
      setError(err as ApiError)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const createAvailability = async (data: CreateAvailabilityDto) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await availabilityApi.createAvailability(data)
      return response
    } catch (err) {
      setError(err as ApiError)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const updateAvailability = async (id: string, data: Partial<CreateAvailabilityDto>) => {
    try {
      setIsLoading(true)
      setError(null)
      console.log(`Updating availability ${id} with data:`, data)
      const response = await availabilityApi.updateAvailability(id, data)
      console.log("Update response:", response)
      return response
    } catch (err) {
      console.error("Error in updateAvailability:", err)
      setError(err as ApiError)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const deleteAvailability = async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await availabilityApi.deleteAvailability(id)
      return response
    } catch (err) {
      setError(err as ApiError)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    getEngineerAvailability,
    getWeeklyAvailability,
    createAvailability,
    updateAvailability,
    deleteAvailability,
    isLoading,
    error,
  }
}

