import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'

interface AdminUser {
  id: string
  user_id: string
  email: string
  full_name: string
  role: string
  permissions: any
  is_active: boolean
  last_login: string | null
  created_at: string
  updated_at: string
}

interface AdminContextType {
  user: User | null
  adminUser: AdminUser | null
  session: Session | null
  loading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  logAdminAction: (actionType: string, targetType?: string, targetId?: string, details?: any) => Promise<void>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await checkAdminStatus(session.user.id)
      } else {
        setAdminUser(null)
        setIsAdmin(false)
      }
      setLoading(false)
    })

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await checkAdminStatus(session.user.id)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkAdminStatus = async (userId: string) => {
    try {
      // First get the user's email
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData.user) {
        setAdminUser(null)
        setIsAdmin(false)
        return
      }

      // Check admin status by user_id or email
      const { data: adminData, error } = await supabase
        .from('admin_users')
        .select('*')
        .or(`user_id.eq.${userId},email.eq.${userData.user.email}`)
        .eq('is_active', true)
        .single()

      if (!error && adminData) {
        setAdminUser(adminData)
        setIsAdmin(true)
        
        // Update user_id if not set and update last login
        const updates: any = { last_login: new Date().toISOString() }
        if (!adminData.user_id) {
          updates.user_id = userId
        }
        
        await supabase
          .from('admin_users')
          .update(updates)
          .eq('id', adminData.id)
      } else {
        setAdminUser(null)
        setIsAdmin(false)
      }
    } catch (error) {
      console.error('Error checking admin status:', error)
      setAdminUser(null)
      setIsAdmin(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const logAdminAction = async (
    actionType: string,
    targetType?: string,
    targetId?: string,
    details?: any
  ) => {
    if (!adminUser) return

    try {
      await supabase.from('admin_sessions').insert({
        admin_id: adminUser.id,
        action_type: actionType,
        target_type: targetType,
        target_id: targetId,
        details: details || {},
      })
    } catch (error) {
      console.error('Error logging admin action:', error)
    }
  }

  const value = {
    user,
    adminUser,
    session,
    loading,
    isAdmin,
    signIn,
    signOut,
    logAdminAction,
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}