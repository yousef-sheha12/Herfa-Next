import MainLayout from '@/components/layout/MainLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import CustomerDashboard from '@/features/customer/Dashboard'

export default function CustomerDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <MainLayout>
        <CustomerDashboard />
      </MainLayout>
    </ProtectedRoute>
  )
}
