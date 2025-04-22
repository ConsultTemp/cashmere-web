import type { BookingState } from "@/app/admin/calendar/types/booking"
import type { RoleType } from "@/store/user-store"
import type { Session as SupabaseSession } from "@supabase/supabase-js"

export interface BookingCreateRequest {
  userId: string | null
  fonicoId: string
  studioId: string
  start: Date
  end: Date
  services: string[]
  notes?: string
  phone: string
  instagram: string
}

export interface BookingCreateResponse {
  access_token: string
  user: {
    id: string
    role: RoleType
    username: string
  }
}

export interface ApiError {
  message: string
  statusCode: number
}

export interface UserSession {
  user: User | null
  session: Session | null
}

export interface User {
  id: string
  email?: string
  user_metadata?: {
    avatar_url?: string
    full_name?: string
    email?: string
  }
}

export interface UserSession {
  user: User | null
  session: Session | null
}

// Estendi il tipo Session di Supabase
export interface Session extends Omit<SupabaseSession, "provider_token"> {
  provider_token?: string
  provider_refresh_token?: string
}

export interface AuthError {
  message: string
  status?: number
}

export interface GooGleLoginDTO {
  supabaseToken: string
}

export interface Booking {
  id: string
  userId: string
  user?:{
    username: string
  }
  fonico?:{
    username: string
  }
  fonicoId: string
  studioId: string
  start: Date
  end: Date
  services: string[]
  notes?: string
  state: BookingState
  phone?: string
  instagram?: string
  created_at: Date
}

export interface Report{
  string: string
  reason: string
  userId?: string
  phone?: string
}

