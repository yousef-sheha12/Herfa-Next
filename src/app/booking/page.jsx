import { Suspense } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import BookingFlow from '@/features/booking/BookingFlow'

export default function BookingPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <Suspense fallback={
          <div className="min-h-screen bg-gray-50 py-20 flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        }>
          <BookingFlow />
        </Suspense>
      </MainLayout>
    </ProtectedRoute>
  )
}
