import MainLayout from '@/components/layout/MainLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import CustomerSettings from '@/features/customer/Settings'

export default function CustomerSettingsPage() {
  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <MainLayout>
        <CustomerSettings />
      </MainLayout>
    </ProtectedRoute>
  )
}
