import AuthLayout from '@/components/layout/AuthLayout'
import ResetPassForm from '@/features/auth/ResetPassForm'

export default function ResetPasswordPage() {
  return (
    <AuthLayout showBackButton={false}>
      <ResetPassForm />
    </AuthLayout>
  )
}
