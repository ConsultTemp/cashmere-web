import { RoleType } from "@/store/user-store"
import type { Session as SupabaseSession } from "@supabase/supabase-js"

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
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

export interface GooGleLoginDTO{
  supabaseToken: string
}