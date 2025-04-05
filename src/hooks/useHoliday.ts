'use client'

import { useState } from "react"
import type { ApiError } from "@/types/auth"
import type { CreateHoliday, HolidayState } from "@/types/types"
import { useUserStore } from "@/store/user-store"
import { holidayApi } from "@/api/holiday"

export const useHoliday = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const { user } = useUserStore()

  const createHoliday = async (holiday: CreateHoliday) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await holidayApi.create(holiday)
      return response
    } catch (err) {
      setError(err as ApiError)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const getAll = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await holidayApi.getAll()
      return response
    } catch (err) {
      setError(err as ApiError)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const getUserHolidays = async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await holidayApi.getUserHolidays(id)
      return response
    } catch (err) {
      setError(err as ApiError)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const updateHolidayState = async (id: string, state: HolidayState) => {
    console.log(id)
    try {
      setIsLoading(true)
      setError(null)
      const response = await holidayApi.updateState(id, state)
      return response
    } catch (err) {
      setError(err as ApiError)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createHoliday,
    getAll,
    getUserHolidays,
    updateHolidayState,
    isLoading,
    error,
  }
}