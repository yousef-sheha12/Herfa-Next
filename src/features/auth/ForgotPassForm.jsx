'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react'
import AuthInput from '@/components/ui/AuthInput'
import { findUserByEmail, setPasswordResetEmail } from '@/lib/authStorage'

export default function ForgotPassForm() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: { email: '' },
  })

  const onSubmit = ({ email }) => {
    const storedUser = findUserByEmail(email)

    if (!storedUser) {
      setError('email', {
        type: 'manual',
        message: 'We could not find an account with this email.',
      })
      return
    }

    setPasswordResetEmail(email)
    router.push('/auth/verify')
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-800 sm:text-3xl">
          Forgot Password?
        </h2>
        <p className="text-gray-500 font-light text-sm leading-relaxed">
          Enter your email address and we&apos;ll send you a recovery link to access your account.
        </p>
        <p className="rounded-full bg-amber-50 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-amber-600 w-fit">
          Demo flow only for emails already saved in local storage
        </p>
      </div>

      <form
        className="mt-1 flex flex-col gap-4 sm:mt-2 sm:gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <AuthInput
          label="Email Address"
          placeholder="e.g. craftsman@herfa.com"
          icon={Mail}
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <button
          type="submit"
          className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-500 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-primary/30 active:scale-95 sm:py-3.5 sm:text-base"
        >
          <span>Send OTP Code</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

      <div className="flex flex-col items-center gap-3 text-center">
        <Link
          href="/auth/login"
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-emerald-500 transition-all duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Login</span>
        </Link>
      </div>
    </>
  )
}
