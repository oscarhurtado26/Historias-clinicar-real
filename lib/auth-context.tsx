"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type User, users, type UserPermissions, hasPermission } from "./data-store"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  checkPermission: (category: keyof UserPermissions, permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = sessionStorage.getItem("laskin_user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      const currentUser = users.find((u) => u.email === parsedUser.email)
      if (currentUser) {
        setUser(currentUser)
        sessionStorage.setItem("laskin_user", JSON.stringify(currentUser))
      } else {
        setUser(parsedUser)
      }
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = users.find((u) => u.email === email && u.password === password)
    if (foundUser) {
      setUser(foundUser)
      sessionStorage.setItem("laskin_user", JSON.stringify(foundUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem("laskin_user")
  }

  const checkPermission = (category: keyof UserPermissions, permission: string): boolean => {
    return hasPermission(user, category, permission)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, checkPermission }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
