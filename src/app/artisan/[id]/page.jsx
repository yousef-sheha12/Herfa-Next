import MainLayout from '@/components/layout/MainLayout'
import ProfileView from '@/features/artisan/ProfileView'

export default async function ArtisanProfilePage({ params }) {
  const { id } = await params
  return (
    <MainLayout>
      <ProfileView id={id} />
    </MainLayout>
  )
}
