"use client"

import { useState } from "react"
import type { ApiError } from "@/types/auth"
import type { CreateReportDto } from "@/types/types"
import { reportApi } from "@/api/report"
import { RoleType } from "@/store/user-store"

export function useReport() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<ApiError | null>(null)

    const createReport = async (data: CreateReportDto) => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await reportApi.createReport(data)
            return response
        } catch (err) {
            setError(err as ApiError)
            return null
        } finally {
            setIsLoading(false)
        }
    }

    const deleteReport = async (id: string) => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await reportApi.deleteReport(id)
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
            const response = await reportApi.getAll()
            return response
        } catch (err) {
            setError(err as ApiError)
            return null
        } finally {
            setIsLoading(false)
        }
    }

    return {
        createReport,
        deleteReport,
        getAll,
        isLoading,
        error,
    }
}