'use client'

import { useState } from "react"
import type { ApiError } from "@/types/auth"
import type { CreateEntity } from "@/types/types"
import { entityApi } from "@/api/entities"
import { useUserStore } from "@/store/user-store"

export const useEntity = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<ApiError | null>(null)
    const { user } = useUserStore()

    const createEntity = async (entity: CreateEntity) => {
        try {
            setIsLoading(true)
            setError(null)
            console.log(user)
            const response = await entityApi.create(entity)
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
            const response = await entityApi.getAll()
            return response
        } catch (err) {
            setError(err as ApiError)
            return null
        } finally {
            setIsLoading(false)
        }
    }

    const getInvoices = async (id: string, query?: { startDate?: string; endDate?: string }) => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await entityApi.getInvoices(id, query)
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
        createEntity,
        getInvoices,
        isLoading,
        error,
    }
}