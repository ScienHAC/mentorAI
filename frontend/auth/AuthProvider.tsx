"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"
import type { SupabaseClient } from "@supabase/supabase-js"

type AuthContextType = {
    user: any | null
    loading: boolean  // Added loading state
    signOut: () => Promise<void>
    supabase: SupabaseClient
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,  // Set default loading state to true
    signOut: async () => { },
    supabase: {} as SupabaseClient,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)  // Added loading state
    const router = useRouter()
    const [supabase] = useState(() =>
        createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!),
    )

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user || null)
            setLoading(false)  // Set loading to false after fetching
        }

        fetchSession()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user || null)
            setLoading(false)  // Set loading to false after auth state change
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [supabase])

    const signOut = async () => {
        setLoading(true)  // Set loading to true during sign out
        await supabase.auth.signOut()
        setUser(null)
        setLoading(false)  // Set loading to false after sign out
        setTimeout(() => router.push("/login"), 100)
    }

    return <AuthContext.Provider value={{ user, loading, signOut, supabase }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)