'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react'
import AuthInput from '@/components/ui/AuthInput'
import RoleToggle from '@/components/ui/RoleToggle'
import SocialLogins from '@/components/ui/SocialLogins'
import { useAuth } from '@/hooks/useAuth'
import { findUserByEmail } from '@/lib/authStorage'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
})

export default function LoginForm() {
  const [activeRole, setActiveRole] = useState('customer')
  const { login, isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push(user?.role === 'artisan' ? '/artisan/dashboard' : '/customer/dashboard')
    }
  }, [isAuthenticated, user, router])

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = (values) => {
    const parsed = loginSchema.safeParse(values)

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0]
        if (typeof field === 'string') {
          setError(field, { type: 'zod', message: issue.message })
        }
      }
      return
    }

    const storedUser = findUserByEmail(values.email)

    if (!storedUser) {
      setError('email', { type: 'manual', message: 'This email is not registered yet.' })
      return
    }

    if (storedUser.role !== activeRole) {
      setError('email', {
        type: 'manual',
        message: `This account is registered as ${storedUser.role}.`,
      })
      return
    }

    if (storedUser.password !== values.password) {
      setError('password', { type: 'manual', message: 'Incorrect password.' })
      return
    }

    login(storedUser)
    reset()
    router.push(
      storedUser.role === 'artisan' ? '/artisan/dashboard' : '/customer/dashboard'
    )
  }

  return (
    <>
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-emerald-500 sm:h-14 sm:w-14">
          <LogIn className="h-6 w-6 sm:h-7 sm:w-7" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-gray-800 sm:text-3xl">
          Welcome Back
        </h2>
        <p className="text-sm font-medium text-gray-400">
          Log in to your Herfa account
        </p>
      </div>

      <RoleToggle activeRole={activeRole} setActiveRole={setActiveRole} />

      <form
        className="flex flex-col gap-3.5 sm:gap-4"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <AuthInput
          label="Email Address"
          icon={Mail}
          placeholder="name@example.com"
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="flex flex-col gap-3">
          <AuthInput
            label="Password"
            icon={Lock}
            placeholder="Enter your password"
            type="password"
            error={errors.password?.message}
            {...register('password')}
          />
          <Link
            href="/auth/forgot-password"
            className="self-end text-[11px] font-bold tracking-[0.14em] text-emerald-500 hover:underline sm:text-xs sm:tracking-wider"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="group mt-1 flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl bg-emerald-500 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-emerald-500/30 active:scale-95 sm:mt-2 sm:py-3.5 sm:text-base"
        >
          <span>Continue as {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)}</span>
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>
      </form>

      <div className="relative my-1 flex h-px items-center justify-center bg-gray-100">
        <span className="bg-white px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">
          Or login with
        </span>
      </div>

      <SocialLogins />

      <p className="text-center text-sm font-medium leading-6 tracking-wide text-gray-500">
        Don't have an account?{' '}
        <Link
          href="/auth/signup"
          className="cursor-pointer font-bold text-emerald-500 transition-all hover:underline underline-offset-4"
        >
          Create account
        </Link>
      </p>
    </>
  )
}
