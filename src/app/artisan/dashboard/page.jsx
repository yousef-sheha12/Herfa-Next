import MainLayout from '@/components/layout/MainLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import ArtisanDashboard from '@/features/artisan/Dashboard'

export default function ArtisanDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['artisan']}>
      <MainLayout>
        <ArtisanDashboard />
      </MainLayout>
    </ProtectedRoute>
  )
}
