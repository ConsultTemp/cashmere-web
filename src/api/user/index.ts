import api from "@/lib/axios"
import { RoleType } from "@/store/user-store"
import axios from "axios"

export class UserApi {
  private static instance: UserApi
  private readonly BASE_PATH = "/users"

  private constructor() { }

  public static getInstance(): UserApi {
    if (!UserApi.instance) {
        UserApi.instance = new UserApi()
    }
    return UserApi.instance
  }

  async getEngineers(): Promise<any> {
    try {
      const response = await api.get<any>(`${this.BASE_PATH}/role/engineer`, {
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
          message: error.response?.data?.message || "Get engineers failed",
          statusCode: error.response?.status || 500,
        }
      }
      throw error
    }
  }

  async getUsers(): Promise<any> {
    try {
      const response = await api.get<any>(`${this.BASE_PATH}/role/user`, {
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
          message: error.response?.data?.message || "Get engineers failed",
          statusCode: error.response?.status || 500,
        }
      }
      throw error
    }
  }

  async getAllUsers(): Promise<any> {
    try {
      const response = await api.get<any>(`${this.BASE_PATH}/all`, {
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
          message: error.response?.data?.message || "Get engineers failed",
          statusCode: error.response?.status || 500,
        }
      }
      throw error
    }
  }

  async updateRole(id: string, role: RoleType): Promise<any> {
    console.log(id)
    try {
      const response = await api.put<any>(`${this.BASE_PATH}/${id}/${role}`, {
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

  async updateEntity(id: string, entityId: string): Promise<any> {
    console.log(id)
    try {
      const response = await api.put<any>(`${this.BASE_PATH}/entity/${id}/${entityId}`, {
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

export const userApi = UserApi.getInstance()