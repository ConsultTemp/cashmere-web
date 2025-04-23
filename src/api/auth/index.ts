import type { GooGleLoginDTO,LoginResponse } from "../../types/auth"
import api from "@/lib/axios"
import axios from "axios"

interface LoginRequest {
  username: string
  password: string
  managerId?: string
}

export class AuthApi {
  private static instance: AuthApi
  private readonly BASE_PATH = "/auth"

  private constructor() {}

  public static getInstance(): AuthApi {
    if (!AuthApi.instance) {
      AuthApi.instance = new AuthApi()
    }
    return AuthApi.instance
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>(`${this.BASE_PATH}/login`, data, {
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw {
          message: error.response?.data?.message || "Login failed",
          statusCode: error.response?.status || 500,
        }
      }
      throw error
    }
  }

  async register(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>(`${this.BASE_PATH}/register`, data, {
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw {
          message: error.response?.data?.message || "Login failed",
          statusCode: error.response?.status || 500,
        }
      }
      throw error
    }
  }

  async googleLogin(data: GooGleLoginDTO): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>(`${this.BASE_PATH}/google`, data, {
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw {
          message: error.response?.data?.message || "Google login failed",
          statusCode: error.response?.status || 500,
        }
      }
      throw error
    }
  }
}

export const authApi = AuthApi.getInstance()