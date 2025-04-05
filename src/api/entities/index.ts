import type {  CreateEntity } from "@/types/types"
import api from "@/lib/axios"
import axios from "axios"

export class EntityApi {
  private static instance: EntityApi
  private readonly BASE_PATH = "/entities"

  private constructor() { }

  public static getInstance(): EntityApi {
    if (!EntityApi.instance) {
      EntityApi.instance = new EntityApi()
    }
    return EntityApi.instance
  }

  async create(entity: CreateEntity): Promise<any> {
    try {
      const response = await api.post<any>(`${this.BASE_PATH}`, entity, {
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      console.log(response)
      return response.data
    } catch (error) {
      console.log(error)
      if (axios.isAxiosError(error)) {
        throw {
          message: error.response?.data?.message || "Booking creation failed",
          statusCode: error.response?.status || 500,
        }
      }
      throw error
    }
  }

  async getAll(): Promise<any> {
    try {
      const response = await api.get<any>(`${this.BASE_PATH}`, {
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      console.log(response.data)
      return response.data
    } catch (error) {
      console.log(error)
      if (axios.isAxiosError(error)) {
        throw {
          message: error.response?.data?.message || " get Booking failed",
          statusCode: error.response?.status || 500,
        }
      }
      throw error
    }
  }


  async getInvoices(id: string, query?: { startDate?: string; endDate?: string }): Promise<any> {
    try {
      const response = await api.get<any>(`${this.BASE_PATH}/${id}/invoices`, {
        headers: {
          "Cache-Control": "no-cache",
        },
        params: query,
      })
      console.log(response.data)
      return response.data
    } catch (error) {
      console.log(error)
      if (axios.isAxiosError(error)) {
        throw {
          message: error.response?.data?.message || "get Booking failed",
          statusCode: error.response?.status || 500,
        }
      }
      throw error
    }
  }




}

export const entityApi = EntityApi.getInstance()