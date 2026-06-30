'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    if (allowedRoles?.length && !allowedRoles.includes(user?.role)) {
      const dashboard = user?.role === 'artisan' ? '/artisan/dashboard' : '/customer/dashboard'
      router.push(dashboard)
    }
  }, [isAuthenticated, user, isLoading, allowedRoles, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <span className="loading loading-spinner loading-lg text-emerald-500" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  if (allowedRoles?.length && !allowedRoles.includes(user?.role)) return null

  return children
}
