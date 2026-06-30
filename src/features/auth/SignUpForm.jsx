'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Mail, Lock, User, ArrowRight, BadgeCheck } from 'lucide-react'
import AuthInput from '@/components/ui/AuthInput'
import RoleToggle from '@/components/ui/RoleToggle'
import SocialLogins from '@/components/ui/SocialLogins'
import { findUserByEmail, setPendingSignup } from '@/lib/authStorage'

const signupSchema = z
  .object({
    fullName: z.string().min(3, 'Full name must be at least 3 characters.'),
    email: z.string().email('Please enter a valid email address.'),
    nationalId: z.string().optional(),
    serviceCategory: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string().min(6, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })
  .superRefine((data, ctx) => {
    if (data.nationalId && !/^\d{15}$/.test(data.nationalId)) {
      ctx.addIssue({
        code: 'custom',
        path: ['nationalId'],
        message: 'National ID must be exactly 15 digits (UAE format).',
      })
    }
  })

export default function SignUpForm() {
  const [activeRole, setActiveRole] = useState('customer')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      nationalId: '',
      serviceCategory: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (values) => {
    const parsed = signupSchema.safeParse(values)

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0]
        if (typeof field === 'string') {
          setError(field, { type: 'zod', message: issue.message })
        }
      }
      return
    }

    if (activeRole === 'artisan') {
      if (!values.nationalId.trim() || !/^\d{15}$/.test(values.nationalId)) {
        setError('nationalId', {
          type: 'zod',
          message: 'National ID is required and must be 15 digits for artisans.',
        })
        return
      }
      if (!values.serviceCategory) {
        setError('serviceCategory', {
          type: 'zod',
          message: 'Service category is required for artisans.',
        })
        return
      }
    }

    const existingUser = findUserByEmail(values.email)

    if (existingUser) {
      setError('email', {
        type: 'manual',
        message: 'This email is already registered.',
      })
      return
    }

    const signupData = {
      fullName: values.fullName,
      email: values.email,
      password: values.password,
      role: activeRole,
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2000&auto=format&fit=crop',
    }
    if (activeRole === 'artisan') {
      signupData.nationalId = values.nationalId
      signupData.serviceCategory = values.serviceCategory
    }
    setPendingSignup(signupData)

    reset()
    clearErrors()
    setActiveRole('customer')

    router.push('/auth/verify')
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-800 sm:text-3xl">
          Create Account.
        </h2>
        <p className="text-sm font-light leading-relaxed text-gray-500">
          Join the Herfa community as an artisan or a customer.
        </p>
      </div>

      <RoleToggle activeRole={activeRole} setActiveRole={setActiveRole} />

      <form
        className="flex flex-col gap-3.5 sm:gap-4"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <div className="grid gap-3.5 md:flex-col md:gap-4">
          <AuthInput
            label="Full Name"
            placeholder="e.g. Yousef Sheha"
            icon={User}
            type="text"
            error={errors.fullName?.message}
            {...register('fullName')}
          />

          <AuthInput
            label="Email Address"
            placeholder="e.g. craftsman@herfa.com"
            icon={Mail}
            type="email"
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        {activeRole === 'artisan' && (
          <div className="space-y-3.5">
            <div className="rounded-[1.4rem] border border-emerald-100 bg-emerald-50/60 p-3 sm:p-4">
              <AuthInput
                label="National ID"
                placeholder="784-1998-XXXXX (15 digits)"
                icon={BadgeCheck}
                type="text"
                error={errors.nationalId?.message}
                {...register('nationalId')}
              />
            </div>
            <div className="rounded-[1.4rem] border border-blue-100 bg-blue-50/60 p-3 sm:p-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Service Category *
              </label>
              <select
                {...register('serviceCategory')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400/50 bg-white"
                defaultValue=""
              >
                <option value="" disabled>
                  Select your main service
                </option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="carpentry">Carpentry</option>
                <option value="hvac">HVAC</option>
                <option value="painting">Painting</option>
                <option value="cleaning">Cleaning</option>
                <option value="gardening">Gardening</option>
                <option value="appliance">Appliance Repair</option>
              </select>
              {errors.serviceCategory && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.serviceCategory.message}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="grid gap-3.5 md:flex-col md:gap-4">
          <AuthInput
            label="Password"
            placeholder="Enter your password"
            icon={Lock}
            type="password"
            error={errors.password?.message}
            {...register('password')}
          />

          <AuthInput
            label="Confirm Password"
            placeholder="Confirm your password"
            icon={Lock}
            type="password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>

        <button
          type="submit"
          className="group mt-1 flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-primary/30 active:scale-95 sm:mt-2 sm:py-3.5 sm:text-base"
        >
          <span>
            Sign Up as {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)}
          </span>
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </form>

      <div className="flex items-center gap-4 py-1">
        <div className="h-[1px] flex-1 bg-gray-100" />
        <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
          OR JOIN WITH
        </span>
        <div className="h-[1px] flex-1 bg-gray-100" />
      </div>

      <SocialLogins />

      <p className="text-center text-sm font-medium leading-6 tracking-wide text-gray-500">
        Already have an account?{' '}
        <Link
          href="/auth/login"
          className="cursor-pointer font-bold text-emerald-500 transition-all hover:underline underline-offset-4"
        >
          Log In instead
        </Link>
      </p>
    </>
  )
}
