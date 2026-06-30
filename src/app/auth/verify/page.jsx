import AuthLayout from '@/components/layout/AuthLayout'
import VerifyForm from '@/features/auth/VerifyForm'

export default function VerifyPage() {
  return (
    <AuthLayout showBackButton={false}>
      <VerifyForm />
    </AuthLayout>
  )
}
