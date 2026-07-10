import MainLayout from '@/components/layout/MainLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import ArtisanEditProfile from '@/features/artisan/ArtisanEditProfile'

export default function ArtisanEditProfilePage() {
  return (
    <ProtectedRoute allowedRoles={['artisan']}>
      <MainLayout>
        <ArtisanEditProfile />
      </MainLayout>
    </ProtectedRoute>
  )
}
