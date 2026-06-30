import AuthLayout from '@/components/layout/AuthLayout'
import SignUpForm from '@/features/auth/SignUpForm'

export default function SignUpPage() {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  )
}
