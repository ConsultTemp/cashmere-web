import type { CreateAvailabilityDto } from "@/types/types"
import api from "@/lib/axios"
import axios from "axios"

export class AvailabilityApi {
  private static instance: AvailabilityApi
  private readonly BASE_PATH = "/availability"

  private constructor() { }

  public static getInstance(): AvailabilityApi {
    if (!AvailabilityApi.instance) {
      AvailabilityApi.instance = new AvailabilityApi()
    }
    return AvailabilityApi.instance
  }

  async getEngineerAvailability(engineerId: string, date: Date): Promise<object> {
    console.log(engineerId)
    console.log(date)
    try {
      const formattedDate = date.toISOString()
      const response = await api.get<object>(`${this.BASE_PATH}/engineer`, {
        params: {
          engineerId,
          date: formattedDate
        },
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      return response.data
    } catch (error) {
      console.log(error)
      if (axios.isAxiosError(error)) {
        throw {
          message: error.response?.data?.message || "Failed to fetch engineer availability",
          statusCode: error.response?.status || 500,
        }
      }
      throw error
    }
  }

  async getUserAvailability(engineerId: string): Promise<object> {
    try {
      const response = await api.get<object>(`${this.BASE_PATH}/user/${engineerId}`, {
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      return response.data
    } catch (error) {
      console.log(error)
      if (axios.isAxiosError(error)) {
        throw {
          message: error.response?.data?.message || "Failed to fetch engineer availability",
          statusCode: error.response?.status || 500,
        }
      }
      throw error
    }
  }

  async getWeeklyAvailability(engineerId: string): Promise<object> {
    try {
      const response = await api.get<object>(`${this.BASE_PATH}/weekly`, {
        params: { engineerId },
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      return response.data
    } catch (error) {
      console.log(error)
      if (axios.isAxiosError(error)) {
        throw {
          message: error.response?.data?.message || "Failed to fetch weekly availability",
          statusCode: error.response?.status || 500,
        }
      }
      throw error
    }
  }

  async createAvailability(data: CreateAvailabilityDto): Promise<object> {
    try {
      const response = await api.post<object>(`${this.BASE_PATH}`, data, {
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      return response.data
    } catch (error) {
      console.log(error)
      if (axios.isAxiosError(error)) {
        throw {
          message: error.response?.data?.message || "Availability creation failed",
          statusCode: error.response?.status || 500,
        }
      }
      throw error
    }
  }

  async updateAvailability(id: string, data: Partial<CreateAvailabilityDto>): Promise<object> {
    try {
      const response = await api.put<object>(`${this.BASE_PATH}/${id}`, data, {
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      return response.data
    } catch (error) {
      console.log(error)
      if (axios.isAxiosError(error)) {
        throw {
          message: error.response?.data?.message || "Availability update failed",
          statusCode: error.response?.status || 500,
        }
      }
      throw error
    }
  }

  async deleteAvailability(id: string): Promise<object> {
    try {
      const response = await api.delete<object>(`${this.BASE_PATH}/${id}`, {
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      return response.data
    } catch (error) {
      console.log(error)
      if (axios.isAxiosError(error)) {
        throw {
          message: error.response?.data?.message || "Availability deletion failed",
          statusCode: error.response?.status || 500,
        }
      }
      throw error
    }
  }
}

export const availabilityApi = AvailabilityApi.getInstance()
