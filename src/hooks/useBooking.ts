"use client"

import { useState } from "react"
import type { ApiError } from "@/types/auth"
import type { CreateBooking, StateType } from "@/types/types"
import { bookingApi } from "@/api/booking"
import { useUserStore } from "@/store/user-store"
import { Booking } from "@/types/booking"

export const useBooking = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<ApiError | null>(null)
    const { user } = useUserStore()
    const [loading, setLoading] = useState(false)
    const [errorUpdate, setErrorUpdate] = useState<string | null>(null)

    const createBooking = async (booking: CreateBooking) => {
        console.log(booking)
        setLoading(true)
        setErrorUpdate(null)
        console.log(booking)
        try {
            console.log("Creating booking with data:", booking)

            // Assicurati che tutti i campi richiesti siano presenti
            if (!booking.studioId) {
                throw new Error("Studio ID is required")
            }

            if (typeof booking.phone !== 'string' || typeof booking.instagram !== 'string') {
                throw new Error("Contact information (phone and Instagram) is required")
            }

            const result = await bookingApi.create(booking, user)
            console.log("Booking created successfully:", result)
            return result
        } catch (err: any) {
            console.error("Error creating booking:", err)
            setErrorUpdate(err.message || "Failed to create booking")
            throw err
        } finally {
            setLoading(false)
        }
    }

    const getAll = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await bookingApi.getAll()
            return response
        } catch (err) {
            setError(err as ApiError)
            return null
        } finally {
            setIsLoading(false)
        }
    }

    const getEngineerBookings = async (id: string) => {
        try {
            setIsLoading(true)
            setError(null)
            console.log("id del fonico",id)
            const response = await bookingApi.getFonicoBookings(id)
            console.log(response)
            return response
        } catch (err) {
            setError(err as ApiError)
            return null
        } finally {
            setIsLoading(false)
        }
    }

    const getUserBookings = async (id: string) => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await bookingApi.getUserBookings(id)
            return response
        } catch (err) {
            setError(err as ApiError)
            return null
        } finally {
            setIsLoading(false)
        }
    }

    const updateBooking = async (id: string, updatedData: Partial<CreateBooking>) => {
        console.log(id)
        try {
            setIsLoading(true)
            setError(null)
            const response = await bookingApi.update(id, updatedData)
            return response
        } catch (err) {
            setError(err as ApiError)
            return null
        } finally {
            setIsLoading(false)
        }
    }

    const updateBookingState = async (id: string, state: StateType, additionalData?: any) => {
        console.log(id)
        try {
            setIsLoading(true)
            setError(null)
            const response = await bookingApi.updateState(id, state, additionalData)
            return response
        } catch (err) {
            setError(err as ApiError)
            return null
        } finally {
            setIsLoading(false)
        }
    }

    const bookingUpdate = async (id: string, booking: Booking) => {
        console.log(id)
        try {
            setIsLoading(true)
            setError(null)
            const response = await bookingApi.updateBooking(id, booking)
            return response
        } catch (err) {
            setError(err as ApiError)
            return null
        } finally {
            setIsLoading(false)
        }
    }

    const deleteBooking = async (id: string) => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await bookingApi.delete(id)
            return response
        } catch (err) {
            setError(err as ApiError)
            return null
        } finally {
            setIsLoading(false)
        }
    }
    

    const getToConfirm = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await bookingApi.getToConfirm()
            return response
        } catch (err) {
            setError(err as ApiError)
            return null
        } finally {
            setIsLoading(false)
        }
    }

    const getAvailableEngineers = async (start: Date, end: Date) => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await bookingApi.getAvailableEngineers(start, end)
            return response
        } catch (err) {
            setError(err as ApiError)
            return null
        } finally {
            setIsLoading(false)
        }
    }

    const getCurrentBookings = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await bookingApi.getCurrentBookings()
            return response
        } catch (err) {
            setError(err as ApiError)
            return null
        } finally {
            setIsLoading(false)
        }
    }

    const getAvailableTimeSlots = async (studioId: string, fonicoId: string) => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await bookingApi.getAvailableTimeSlots(studioId, fonicoId)
            return response
        } catch (err) {
            setError(err as ApiError)
            return null
        } finally {
            setIsLoading(false)
        }
    }

    const getAvailableStudios = async (start: Date, end: Date) => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await bookingApi.getAvailableStudio(start, end)
            return response
        } catch (err) {
            setError(err as ApiError)
            return null
        } finally {
            setIsLoading(false)
        }
    }

    const getEngineerFutureBookings = async (id: string) => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await bookingApi.getEngineerFutureBookings(id)
            return response
        } catch (err) {
            setError(err as ApiError)
            return null
        } finally {
            setIsLoading(false)
        }
    }



    return {
        getAll,
        createBooking,
        updateBooking,
        getAvailableEngineers,
        deleteBooking,
        getToConfirm,
        getUserBookings,
        getAvailableStudios,
        getEngineerBookings,
        getAvailableTimeSlots,
        getCurrentBookings,
        getEngineerFutureBookings,
        updateBookingState,
        bookingUpdate,
        isLoading,
        error,
        loading,
    }
}

