import AuthLayout from '@/components/layout/AuthLayout'
import ForgotPassForm from '@/features/auth/ForgotPassForm'

export default function ForgotPasswordPage() {
  return (
    <AuthLayout showBackButton={false}>
      <ForgotPassForm />
    </AuthLayout>
  )
}
