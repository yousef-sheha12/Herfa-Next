import MainLayout from '@/components/layout/MainLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import ArtisanProfileForm from '@/features/artisan/ArtisanProfileForm'

export default function ArtisanCreateProfilePage() {
  return (
    <ProtectedRoute allowedRoles={['artisan']}>
      <MainLayout>
        <ArtisanProfileForm />
      </MainLayout>
    </ProtectedRoute>
  )
}
