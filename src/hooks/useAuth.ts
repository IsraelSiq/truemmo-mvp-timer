import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user,    setUser]    = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signInWithEmail(email: string, password: string) {
    if (!supabase) throw new Error('Supabase não configurado')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function signUpWithEmail(email: string, password: string) {
    if (!supabase) throw new Error('Supabase não configurado')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
  }

  async function signInWithGoogle() {
    if (!supabase) throw new Error('Supabase não configurado')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })
    if (error) throw error
  }

  async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
  }

  const displayName: string =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.user_metadata?.display_name ??
    user?.email?.split('@')[0] ??
    ''

  return { user, loading, displayName, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut }
}
