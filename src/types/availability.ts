import { RoleType } from "@/store/user-store"

export interface AvailabilityCreateRequest {
  userId: string
  day: string
  start: string
  end: string
}

export interface AvailabilityCreateResponse {
  access_token: string
  user: {
    id: string
    role: RoleType
    username: string
  }
}