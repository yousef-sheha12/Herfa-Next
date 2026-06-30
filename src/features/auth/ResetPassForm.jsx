'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Lock, ArrowRight, ShieldAlert } from 'lucide-react'
import AuthInput from '@/components/ui/AuthInput'
import {
  clearPasswordResetEmail,
  getPasswordResetEmail,
  updateUserPassword,
} from '@/lib/authStorage'

export default function ResetPassForm() {
  const router = useRouter()
  const [email, setEmail] = useState(null)

  useEffect(() => {
    setEmail(getPasswordResetEmail())
  }, [])

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: { password: '', confirmPassword: '' },
  })

  const onSubmit = ({ password, confirmPassword }) => {
    const currentEmail = getPasswordResetEmail()
    if (!currentEmail) {
      router.push('/auth/forgot-password')
      return
    }

    if (password.length < 6) {
      setError('password', {
        type: 'manual',
        message: 'Password must be at least 6 characters.',
      })
      return
    }

    if (password !== confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match.',
      })
      return
    }

    updateUserPassword(currentEmail, password)
    clearPasswordResetEmail()
    router.push('/auth/login')
  }

  return (
    <>
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent sm:h-16 sm:w-16">
          <ShieldAlert size={28} />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-800 sm:text-3xl">
          Reset Password.
        </h2>
        <p className="px-2 text-sm font-light leading-relaxed text-gray-500">
          Create a new, strong password to secure your account.
        </p>
        <p className="rounded-full bg-amber-50 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-amber-600">
          {email ? `Demo reset for ${email}` : 'Temporary demo password reset'}
        </p>
      </div>

      <form
        className="mt-1 flex flex-col gap-3.5 sm:mt-2 sm:gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <AuthInput
          label="New Password"
          placeholder="********"
          icon={Lock}
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />

        <AuthInput
          label="Confirm New Password"
          placeholder="********"
          icon={Lock}
          type="password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <button
          type="submit"
          className="group mt-1 flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-500 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-primary/30 active:scale-95 sm:mt-2 sm:py-3.5 sm:text-base"
        >
          <span>Update Password</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </>
  )
}
