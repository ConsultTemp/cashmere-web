import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"
import type { User } from "@/store/user-store"

export function useAuthCallback() {
    const { googleLogin } = useAuth()
    const router = useRouter()

    const handleSupabaseSession = async () => {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error || !session) {
            throw new Error('No session found')
        }
        return session
    }

    const handleGoogleAuth = async (supabaseToken: string) => {
        const response = await googleLogin({ supabaseToken })
        if (!response?.user) {
            throw new Error('Failed to get user data')
        }
        return response.user as User
    }

    const processAuthCallback = async () => {
        try {
            // 1. Verifica token nell'URL
            const hashParams = new URLSearchParams(window.location.hash.substring(1))
            const accessToken = hashParams.get('access_token')

            if (!accessToken) {
                const session = await handleSupabaseSession()
                return { session, user: null }
            }

            // 2. Refresh e ottieni sessione
            await supabase.auth.refreshSession()
            const session = await handleSupabaseSession()

            // 3. Autentica con il backend
            const user = await handleGoogleAuth(session.access_token)
            console.log(user)
            console.log(session)
            return { session, user }
        } catch (error) {
            console.error("Auth callback error:", error)
            throw error
        }
    }

    return { processAuthCallback }
}