import MainLayout from '@/components/layout/MainLayout'
import ProfileView from '@/features/artisan/ProfileView'

export default function ArtisanProfilePage({ params }) {
  return (
    <MainLayout>
      <ProfileView id={params.id} />
    </MainLayout>
  )
}
