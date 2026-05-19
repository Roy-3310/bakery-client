import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  refreshSession,
} from '../services/authService'
import type { User } from '../types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role?: 'admin' | 'staff') => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    refreshSession()
      .then(u => setUser(u))
      .finally(() => setIsLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const u = await apiLogin(email, password)
    setUser(u)
  }

  const register = async (
    name: string,
    email: string,
    password: string,
    role: 'admin' | 'staff' = 'staff'
  ) => {
    const u = await apiRegister(name, email, password, role)
    setUser(u)
  }

  const logout = async () => {
    await apiLogout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
