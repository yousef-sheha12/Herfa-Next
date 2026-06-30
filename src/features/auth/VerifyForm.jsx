'use client'

import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react'
import {
  clearPendingSignup,
  createUser,
  getPendingSignup,
  getPasswordResetEmail,
} from '@/lib/authStorage'

export default function VerifyForm() {
  const router = useRouter()
  const [flowData, setFlowData] = useState({ pendingSignup: null, resetEmail: null })

  useEffect(() => {
    setFlowData({
      pendingSignup: getPendingSignup(),
      resetEmail: getPasswordResetEmail(),
    })
  }, [])

  const isSignupFlow = Boolean(flowData.pendingSignup)
  const email = flowData.pendingSignup?.email || flowData.resetEmail

  const [otp, setOtp] = useState(new Array(6).fill(''))
  const inputRefs = useRef([])

  const handleChange = (element, index) => {
    const value = element.value
    if (isNaN(value)) return false

    const newOtp = [...otp]
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handleContinue = () => {
    const pd = getPendingSignup()
    if (pd) {
      createUser({
        name: pd.fullName,
        email: pd.email,
        password: pd.password,
        role: pd.role,
        nationalId: pd.nationalId,
        avatar: pd.avatar,
      })
      clearPendingSignup()
      router.push('/auth/login')
      return
    }
    router.push('/auth/reset-password')
  }

  return (
    <>
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 sm:h-16 sm:w-16">
          <ShieldCheck size={28} />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-800 sm:text-3xl">
          Verify Account.
        </h2>
        <p className="px-2 text-sm font-light leading-relaxed text-gray-500 sm:px-4">
          {isSignupFlow
            ? 'Enter the 6-digit code to complete your demo signup verification.'
            : 'Enter the 6-digit code sent to your email to continue the password reset demo flow.'}
        </p>
        <p className="rounded-full bg-amber-50 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-amber-600">
          {email ? `Code sent to ${email}` : 'Temporary demo verification'}
        </p>
      </div>

      <form
        className="mt-1 flex flex-col gap-4 sm:mt-2 sm:gap-5"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="grid grid-cols-6 gap-2 sm:gap-3">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              ref={(el) => (inputRefs.current[index] = el)}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={(e) => e.target.select()}
              className="h-11 w-full rounded-xl border border-transparent bg-gray-100 text-center text-lg font-bold outline-none transition-all duration-300 focus:border-emerald-500/30 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 sm:h-12 sm:text-xl md:h-14 md:text-2xl"
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-500 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-emerald-500/30 active:scale-95 sm:py-3.5 sm:text-base"
        >
          <span>{isSignupFlow ? 'Verify & Go To Login' : 'Verify & Continue'}</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-sm font-medium text-gray-500">
          Didn&apos;t receive code?{' '}
          <button className="text-emerald-500 font-bold hover:underline">
            Resend Code
          </button>
        </p>
        <Link
          href={isSignupFlow ? '/auth/signup' : '/auth/forgot-password'}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-emerald-500 transition-all duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{isSignupFlow ? 'Back to Sign Up' : 'Edit Email Address'}</span>
        </Link>
      </div>
    </>
  )
}
