import type { Report, CreateReportDto } from "@/types/types"
import api from "@/lib/axios"
import axios from "axios"

export class ReportApi {
  private static instance: ReportApi
  private readonly BASE_PATH = "/report"

  private constructor() { }

  public static getInstance(): ReportApi {
    if (!ReportApi.instance) {
      ReportApi.instance = new ReportApi()
    }
    return ReportApi.instance
  }

  async createReport(data: CreateReportDto): Promise<any> {
    console.log(data)
    try {
      const response = await api.post<any>(`${this.BASE_PATH}`, data, {
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      return response.data
    } catch (error) {
      console.log(error)
      if (axios.isAxiosError(error)) {
        throw {
          message: error.response?.data?.message || "Report creation failed",
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

  async deleteReport(id: string): Promise<any> {
    try {
      const response = await api.delete<any>(`${this.BASE_PATH}/${id}`, {
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      return response.data
    } catch (error) {
      console.log(error)
      if (axios.isAxiosError(error)) {
        throw {
          message: error.response?.data?.message || "Report deletion failed",
          statusCode: error.response?.status || 500,
        }
      }
      throw error
    }
  }
}

export const reportApi = ReportApi.getInstance()
