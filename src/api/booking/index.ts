import type { CreateBooking, StateType } from "@/types/types"
import api from "@/lib/axios"
import axios from "axios"
import type { User } from "@/store/user-store"
import { Booking } from "@/types/booking"

export class BookingApi {
  private static instance: BookingApi
  private readonly BASE_PATH = "/booking"

  private constructor() { }

  public static getInstance(): BookingApi {
    if (!BookingApi.instance) {
      BookingApi.instance = new BookingApi()
    }
    return BookingApi.instance
  }

  async create(booking: CreateBooking, user?: User): Promise<any> {
    console.log("API: Creating booking with data:", booking)
    try {
      // Assicurati che tutti i campi richiesti siano presenti
      if (!booking.studioId) {
        throw new Error("Studio ID is required")
      }

      if (typeof booking.phone !== 'string' || typeof booking.instagram !== 'string') {
        throw new Error("Contact information (phone and Instagram) is required")
      }

      const response = await api.post<any>(`${this.BASE_PATH}`, booking, {
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      console.log("API: Booking creation response:", response)
      return response.data
    } catch (error) {
      console.error("API: Booking creation error:", error)
      if (axios.isAxiosError(error)) {
        throw {
          message: error.response?.data?.message || "Booking creation failed",
          statusCode: error.response?.status || 500,
        }
      }
      throw error
    }
  }

  // Altri metodi rimangono invariati...
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

  async getAvailableEngineers(start: Date, end: Date): Promise<any> {
    try {
      const response = await api.get<any>(`${this.BASE_PATH}/available-engineers`, {
        params: { start, end },
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
          message: error.response?.data?.message || "Get available engineers failed",
          statusCode: error.response?.status || 500,
        }
      }
      throw error
    }
  }

  async getFonicoBookings(id: string): Promise<any> {
    try {
      const response = await api.get<any>(`${this.BASE_PATH}/fonico/${id}`, {
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

  async getUserBookings(id: string): Promise<any> {
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

  async getAvailableTimeSlots(studioId: string, fonicoId: string): Promise<any> {
    try {
      const response = await api.get<any>(`${this.BASE_PATH}/available-slots`, {
        params: { studioId, fonicoId },
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
          message: error.response?.data?.message || "Get available time slots failed",
          statusCode: error.response?.status || 500,
        }
      }
      throw error
    }
  }

  async getAvailableStudio(start: Date, end: Date): Promise<any> {
    try {
      const response = await api.get<any>(`${this.BASE_PATH}/available-studios`, {
        params: { start, end },
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
          message: error.response?.data?.message || "Get available time slots failed",
          statusCode: error.response?.status || 500,
        }
      }
      throw error
    }
  }

  async getCurrentBookings(): Promise<any> {
    try {
      const response = await api.get<any>(`${this.BASE_PATH}/current`, {
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
          message: error.response?.data?.message || "Get current bookings failed",
          statusCode: error.response?.status || 500,
        }
      }
      throw error
    }
  }

  async update(id: string, updatedBooking: Partial<CreateBooking>): Promise<any> {
    console.log(id)
    try {
      const response = await api.put<any>(`${this.BASE_PATH}/${id}`, updatedBooking, {
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

  async delete(id: string): Promise<any> {
    try {
      const response = await api.delete<any>(`${this.BASE_PATH}/${id}`, {
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
          message: error.response?.data?.message || "Booking deletion failed",
          statusCode: error.response?.status || 500,
        }
      }
      throw error
    }
  }

  async getToConfirm(): Promise<any> {
    try {
      const response = await api.get<any>(`${this.BASE_PATH}/confirm`, {
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

  // Aggiorna il metodo updateState per supportare dati aggiuntivi
  async updateState(id: string, state: StateType, additionalData?: any): Promise<any> {
    console.log(id)
    try {
      // Crea un oggetto con i dati da inviare
      const data = additionalData ? { state, ...additionalData } : { state }

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

  async updateBooking(id: string, booking:Booking): Promise<any> {
    console.log(id)
    try {
      const response = await api.put<any>(`${this.BASE_PATH}/${id}`, booking, {
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

export const bookingApi = BookingApi.getInstance()

