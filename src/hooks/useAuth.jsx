'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  findUserByEmail,
  setPendingSignup,
  getPendingSignup,
  clearPendingSignup,
  setPasswordResetEmail,
  getPasswordResetEmail,
  clearPasswordResetEmail,
  createUser,
  updateUserPassword,
} from '@/lib/authStorage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    try {
      const stored = localStorage.getItem('herfa-auth')
      if (stored) {
        const { user: storedUser, token: storedToken } = JSON.parse(stored)
        setUser(storedUser)
        setToken(storedToken)
      }
    } catch {
      localStorage.removeItem('herfa-auth')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback((userData) => {
    const newToken = crypto.randomUUID()
    const userWithMeta = {
      ...userData,
      lastLogin: new Date().toISOString(),
    }
    localStorage.setItem('herfa-auth', JSON.stringify({ user: userWithMeta, token: newToken }))
    setUser(userWithMeta)
    setToken(newToken)
    return newToken
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('herfa-auth')
    setUser(null)
    setToken(null)
    router.push('/')
  }, [router])

  const signUp = useCallback((formData) => {
    setPendingSignup(formData)
  }, [])

  const verifyOTP = useCallback(() => {
    const pending = getPendingSignup()
    if (!pending) return false

    const newUser = createUser({
      name: pending.name,
      email: pending.email,
      password: pending.password,
      role: pending.role,
      phone: pending.phone || '',
      nationalId: pending.nationalId || '',
      serviceCategory: pending.serviceCategory || '',
    })

    clearPendingSignup()
    return newUser
  }, [])

  const forgotPassword = useCallback((email) => {
    const user = findUserByEmail(email)
    if (!user) return false
    setPasswordResetEmail(email)
    return true
  }, [])

  const resetPassword = useCallback((newPassword) => {
    const email = getPasswordResetEmail()
    if (!email) return false

    const result = updateUserPassword(email, newPassword)
    clearPasswordResetEmail()
    return result
  }, [])

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoggedIn: !!token,
    isLoading,
    login,
    logout,
    signUp,
    verifyOTP,
    forgotPassword,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
