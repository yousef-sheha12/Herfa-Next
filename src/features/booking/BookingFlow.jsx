'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Check, ArrowLeft, ArrowRight, Hammer } from 'lucide-react'
import useCustomerStore from '@/store/customerStore'
import { useAuth } from '@/hooks/useAuth'
import { SERVICE_CATEGORIES, BOOKING_STEPS } from '@/constants'

export default function BookingFlow() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const preselectedService = searchParams.get('service')
  const createRequest = useCustomerStore((s) => s.createRequest)

  const [step, setStep] = useState(1)
  const [category, setCategory] = useState(
    preselectedService
      ? SERVICE_CATEGORIES.find((c) => c.name.toLowerCase() === preselectedService)?.name || ''
      : ''
  )
  const [description, setDescription] = useState('')
  const [urgency, setUrgency] = useState('standard')

  if (user?.role === 'artisan') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Hammer size={40} className="text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Artisan Account</h2>
          <p className="text-gray-500 mb-8">
            Service requests can only be created from a customer account. Please switch to a customer account or visit your dashboard to manage incoming requests.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/" className="btn btn-ghost text-gray-600">Back to Home</Link>
            <Link href="/artisan/dashboard" className="btn bg-primary text-white hover:bg-primary-dark">Go to Dashboard</Link>
          </div>
        </div>
      </div>
    )
  }

  const handleNext = () => {
    if (step === 1 && !category) {
      toast.error('Please select a service category')
      return
    }
    if (step === 2 && !description.trim()) {
      toast.error('Please describe your service needs')
      return
    }
    setStep((s) => Math.min(s + 1, 3))
  }

  const handleBack = () => setStep((s) => Math.max(s - 1, 1))

  const handleSubmit = () => {
    createRequest({ category, description, urgency })
    setStep(3)
  }

  const handleGoToDashboard = () => {
    router.push('/customer/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-center mb-8">
          {BOOKING_STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  step > i + 1
                    ? 'bg-primary text-white'
                    : step === i + 1
                    ? 'bg-primary text-white ring-4 ring-primary/20'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > i + 1 ? <Check size={18} /> : s.id}
              </div>
              {i < BOOKING_STEPS.length - 1 && (
                <div
                  className={`w-16 sm:w-24 h-1 mx-2 rounded ${
                    step > i + 1 ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Service Category</h2>
            <div className="grid grid-cols-2 gap-4">
              {SERVICE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.name)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    category === cat.name
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">Professional service</p>
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-8">
              <button onClick={handleNext} className="btn bg-primary text-white hover:bg-primary-dark">
                Next Step
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Describe Your Needs</h2>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700">Service Description</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what needs to be done..."
                  rows={5}
                  className="textarea textarea-bordered bg-white text-gray-900 resize-none"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700">Urgency</span>
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setUrgency('standard')}
                    className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${
                      urgency === 'standard'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200'
                    }`}
                  >
                    <span className="font-medium text-gray-900">Standard</span>
                    <p className="text-sm text-gray-500 mt-1">Within 3-5 days</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrgency('urgent')}
                    className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${
                      urgency === 'urgent'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200'
                    }`}
                  >
                    <span className="font-medium text-gray-900">Urgent</span>
                    <p className="text-sm text-gray-500 mt-1">Within 24 hours</p>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-8">
              <button onClick={handleBack} className="btn btn-ghost text-gray-600">
                <ArrowLeft size={18} />
                Back
              </button>
              <button onClick={handleSubmit} className="btn bg-primary text-white hover:bg-primary-dark">
                Submit Request
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h2>
            <p className="text-gray-500 mb-8">
              Your service request has been submitted successfully. An artisan will be assigned to you shortly.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/" className="btn btn-ghost text-gray-600">
                Back to Home
              </Link>
              <button onClick={handleGoToDashboard} className="btn bg-primary text-white hover:bg-primary-dark">
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
