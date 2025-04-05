import type { CreateBooking, CreateHoliday, HolidayState } from "@/types/types"
import api from "@/lib/axios"
import axios from "axios"

export class HoldayApi {
  private static instance: HoldayApi
  private readonly BASE_PATH = "/holiday"

  private constructor() { }

  public static getInstance(): HoldayApi {
    if (!HoldayApi.instance) {
      HoldayApi.instance = new HoldayApi()
    }
    return HoldayApi.instance
  }

  async create(holiday: CreateHoliday): Promise<any> {
    console.log("Arcicazzo")
    console.log(holiday)
    try {
      const response = await api.post<any>(`${this.BASE_PATH}`, holiday, {
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw {
          message: error.response?.data?.message || "Availability creation failed",
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

  async getUserHolidays(id: string): Promise<any> {
    try {
      const response = await api.get<any>(`${this.BASE_PATH}/user/${id}`, {
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

  async updateState(id: string, state: HolidayState): Promise<any> {
    console.log(id)
    try {
      const response = await api.put<any>(`${this.BASE_PATH}/${id}/${state}`, {
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
          message: error.response?.data?.message || "Booking update failed",
          statusCode: error.response?.status || 500,
        }
      }
      throw error
    }
  }
}

export const holidayApi = HoldayApi.getInstance()