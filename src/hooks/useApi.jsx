'use client'

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useLogin, useRegister, useForgotPassword, useResetPassword, useLogout } from '@/hooks/auth/useAuth'
import { setAuth, clearAuth } from '@/lib/authStorage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const loginMutation = useLogin()
  const registerMutation = useRegister()
  const forgotPasswordMutation = useForgotPassword()
  const resetPasswordMutation = useResetPassword()
  const logoutMutation = useLogout()

  useEffect(() => {
    try {
      const stored = localStorage.getItem('herfa-auth')
      if (stored) {
        const { user: storedUser, token: storedToken } = JSON.parse(stored)
        if (storedUser) {
          if (storedUser.role) {
          storedUser.role = storedUser.role.toLowerCase();
          if (storedUser.role === "client") storedUser.role = "customer";
        }
        }
        setUser(storedUser)
        setToken(storedToken)
      }
    } catch {
      localStorage.removeItem('herfa-auth')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(async (userData) => {
    const res = await loginMutation.mutateAsync(userData)
    const data = res.data
    const newToken = data.token || data.data?.token
    const userInfo = data.user || data.data?.user || data
    if (userInfo && userInfo.role) userInfo.role = userInfo.role.toLowerCase()

    if (userInfo.role === "artisan") {
      try {
        const artisansRes = await import("@/services/api").then(m => m.default.get("/artisans"))
        const artisans = Array.isArray(artisansRes.data) ? artisansRes.data : artisansRes.data?.data || []
        const myProfile = artisans.find(a => a.userId === userInfo.id)
        if (myProfile) userInfo.artisanId = myProfile.id
      } catch {}
    }

    setAuth(userInfo, newToken)
    setUser(userInfo)
    setToken(newToken)
    return res
  }, [loginMutation])

  const logout = useCallback(() => {
    logoutMutation.mutate({})
    clearAuth()
    setUser(null)
    setToken(null)
    router.push('/')
  }, [router, logoutMutation])

  const signUp = useCallback(async (formData) => {
    const res = await registerMutation.mutateAsync(formData)
    return res
  }, [registerMutation])

  const forgotPassword = useCallback(async (email) => {
    const res = await forgotPasswordMutation.mutateAsync({ email })
    return res
  }, [forgotPasswordMutation])

  const resetPassword = useCallback(async (data) => {
    const res = await resetPasswordMutation.mutateAsync(data)
    return res
  }, [resetPasswordMutation])

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: !!token,
    isLoggedIn: !!token,
    isLoading,
    login,
    logout,
    signUp,
    forgotPassword,
    resetPassword,
    loginLoading: loginMutation.isPending,
    registerLoading: registerMutation.isPending,
  }), [user, token, isLoading, login, logout, signUp, forgotPassword, resetPassword, loginMutation.isPending, registerMutation.isPending])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
