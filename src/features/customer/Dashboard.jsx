'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  Calendar,
  ChevronRight,
  ChevronLeft,
  Check,
  ShieldCheck,
  PaintBucket,
  Wrench,
  Droplet,
  Hammer,
  Zap,
  Gift,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import useCustomerStore from '@/store/customerStore'
import dynamic from 'next/dynamic'

const ArtisansMap = dynamic(() => import('@/components/maps/ArtisansMap'), { ssr: false })

function ServiceIcon({ iconName, size = 24 }) {
  const icons = { carpentry: Hammer, plumbing: Droplet, electrical: Zap, painting: PaintBucket, general: Wrench, maintenance: Wrench }
  const Icon = icons[iconName?.toLowerCase()]
  return Icon ? <Icon size={size} /> : null
}

const statusColors = {
  accepted: { iconBg: 'bg-[#FDF2E9]', iconText: 'text-[#E67E22]', badge: 'bg-[#EBF5FB] text-[#2E86C1]' },
  pending: { iconBg: 'bg-[#E1F5FE]', iconText: 'text-[#01579B]', badge: 'bg-[#FEF9E7] text-[#F1C40F]' },
  inProgress: { iconBg: 'bg-[#E8F5E9]', iconText: 'text-[#2ECC71]', badge: 'bg-[#E8F5E9] text-[#2ECC71]' },
}

function StatusCard({ icon, title, status, date, artisan, action = 'Details' }) {
  const theme = statusColors[status?.toLowerCase()] || statusColors.pending
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-50 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl ${theme.iconBg} ${theme.iconText}`}>
            <ServiceIcon iconName={icon} size={24} />
          </div>
          <div>
            <h4 className="text-[14px] font-bold text-slate-800">{title}</h4>
            <p className="text-[10px] text-slate-400 font-medium">
              Artisan: {artisan || 'Matching...'}
            </p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${theme.badge}`}>
          {status}
        </span>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
          <Calendar size={12} /> <span>{date}</span>
        </div>
        <button
          className={`text-[10px] font-black uppercase tracking-widest ${
            action === 'Rate Task' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-800'
          }`}
        >
          {action}
        </button>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { requests, createRequest } = useCustomerStore()
  const { user } = useAuth()
  const router = useRouter()

  const [currentPage, setCurrentPage] = useState(1)
  const requestsPerPage = 5

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    urgency: 'Standard',
  })

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    }
  }, [user, router])

  const categories = [
    { id: 'carpentry', name: 'Carpentry', icon: Hammer, color: 'bg-orange-500' },
    { id: 'plumbing', name: 'Plumbing', icon: Droplet, color: 'bg-blue-500' },
    { id: 'electrical', name: 'Electrical', icon: Zap, color: 'bg-yellow-500' },
    { id: 'painting', name: 'Painting', icon: PaintBucket, color: 'bg-emerald-500' },
    { id: 'maintenance', name: 'General', icon: Wrench, color: 'bg-slate-500' },
  ]

  const allOngoingRequests = useMemo(() => {
    return [...(requests.pending || []), ...(requests.accepted || []), ...(requests.inProgress || [])].map(
      (request, index) => ({ ...request, uniqueKey: `${request.id}-${index}` })
    )
  }, [requests])

  const totalPages = Math.ceil(allOngoingRequests.length / requestsPerPage)
  const currentRequests = allOngoingRequests.slice(
    (currentPage - 1) * requestsPerPage,
    currentPage * requestsPerPage
  )

  const nextStep = () => step < 3 && setStep(step + 1)
  const prevStep = () => step > 1 && setStep(step - 1)

  const handleSubmitRequest = () => {
    createRequest({
      service: formData.category,
      category: formData.category,
      description: formData.description,
      urgency: formData.urgency,
      price: 0,
      id: `req-${Date.now()}`,
      status: 'pending',
      icon: formData.category,
      date: new Date().toLocaleDateString(),
      color: 'orange',
    })
    setStep(1)
    setFormData({ category: '', description: '', urgency: 'Standard' })
    alert('Service request submitted successfully!')
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="pt-24 lg:pt-28 max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#F8F9FA] p-8 lg:p-12 border border-slate-100 flex justify-between items-center mb-8 shadow-sm">
          <div className="relative z-10 flex flex-col gap-4 max-w-xl">
            <div className="px-3 py-1 bg-[#FDEBD0] text-[#D4AC0D] text-[10px] flex items-center gap-2 font-bold uppercase tracking-widest rounded-md w-fit">
              <Gift size={12} />
              YOUR SANCTUARY
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-[#1A1A1A] lg:text-5xl leading-tight">
              Expert care for the <br /> home you love,{' '}
              {user?.name?.split(' ')[0] || 'Friend'}.
            </h1>
            <p className="text-slate-500 font-medium leading-relaxed text-base max-w-md">
              Book handpicked artisans for everything from artisan carpentry to essential plumbing, all within your neighborhood.
            </p>
          </div>
          <div className="hidden lg:block w-72 h-64 relative">
            <img
              src="/images/hero-bg.png"
              alt="Herfa Home Care"
              className="w-full h-full object-cover rounded-[2rem] shadow-xl border-[8px] border-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-24">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="w-full bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl">
              <div className="w-full flex items-center justify-between mb-16 relative px-4">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0 rounded-full" />
                <div
                  className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 z-0 rounded-full transition-all duration-700"
                  style={{ width: `${((step - 1) / 2) * 100}%` }}
                />
                {[1, 2, 3].map((s) => (
                  <div key={s} className="relative z-10 flex flex-col items-center gap-3">
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black transition-all duration-500 border-4 border-white shadow-lg ${
                        step >= s ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {step > s ? <Check size={20} /> : s}
                    </div>
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest hidden md:block ${
                        step >= s ? 'text-emerald-500' : 'text-slate-400'
                      }`}
                    >
                      {s === 1 ? 'Category' : s === 2 ? 'Details' : 'Confirm'}
                    </span>
                  </div>
                ))}
              </div>

              {step === 1 && (
                <div className="flex flex-col gap-10">
                  <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">What do you need help with?</h2>
                    <p className="text-slate-400 font-medium text-lg">Select a category to find specialized masters.</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {categories.map((cat) => {
                      const Icon = cat.icon
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setFormData({ ...formData, category: cat.id })}
                          className={`p-6 md:p-8 rounded-[2rem] border-2 transition-all duration-300 flex flex-col items-center gap-4 active:scale-95 ${
                            formData.category === cat.id
                              ? 'border-emerald-500 bg-emerald-50/30 shadow-xl'
                              : 'border-slate-50 bg-slate-50/50 hover:bg-white hover:border-slate-200'
                          }`}
                        >
                          <div
                            className={`p-3 md:p-4 rounded-2xl ${cat.color} text-white shadow-lg ${
                              formData.category === cat.id ? 'scale-110' : ''
                            } transition-transform`}
                          >
                            <Icon size={28} />
                          </div>
                          <span
                            className={`font-black text-sm md:text-base ${
                              formData.category === cat.id ? 'text-emerald-500' : 'text-slate-600'
                            }`}
                          >
                            {cat.name}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-10">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">Describe the project</h2>
                  <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">
                        Problem Description
                      </label>
                      <textarea
                        rows={5}
                        placeholder="Tell us what needs fixing..."
                        className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:bg-white focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium resize-none"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">
                        Urgency Level
                      </label>
                      <div className="flex gap-3">
                        {['Standard', 'Urgent'].map((u) => (
                          <button
                            key={u}
                            onClick={() => setFormData({ ...formData, urgency: u })}
                            className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all border-2 ${
                              formData.urgency === u
                                ? 'bg-emerald-500 text-white border-emerald-500'
                                : 'bg-white text-slate-400 border-slate-100'
                            }`}
                          >
                            {u}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col items-center text-center gap-8 py-10">
                  <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-[2.5rem] flex items-center justify-center animate-pulse">
                    <ShieldCheck size={48} />
                  </div>
                  <h2 className="text-4xl font-black text-slate-800 tracking-tight">Request Ready!</h2>
                  <p className="text-slate-500 font-medium text-lg max-w-md">
                    Verified masters will receive your request immediately.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between mt-12 pt-10 border-t border-slate-50">
                {step < 3 && (
                  <button
                    onClick={prevStep}
                    className={`flex items-center gap-2 px-6 py-4 font-black transition-all ${
                      step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-slate-800'
                    }`}
                  >
                    <ChevronLeft size={20} /> Back
                  </button>
                )}
                {step === 1 && (
                  <button
                    disabled={!formData.category}
                    onClick={nextStep}
                    className={`flex items-center gap-3 px-10 py-4 rounded-full font-black text-lg transition-all ${
                      formData.category ? 'bg-emerald-500 text-white shadow-xl hover:scale-105' : 'bg-slate-100 text-slate-300'
                    }`}
                  >
                    Next <ChevronRight size={20} />
                  </button>
                )}
                {step === 2 && (
                  <button
                    disabled={!formData.description.trim()}
                    onClick={nextStep}
                    className={`flex items-center gap-3 px-10 py-4 rounded-full font-black text-lg transition-all ${
                      formData.description.trim()
                        ? 'bg-emerald-500 text-white shadow-xl hover:scale-105'
                        : 'bg-slate-100 text-slate-300'
                    }`}
                  >
                    Review <Zap size={20} />
                  </button>
                )}
                {step === 3 && (
                  <button
                    onClick={handleSubmitRequest}
                    className="flex items-center gap-3 px-12 py-5 bg-slate-800 text-white rounded-full font-black text-lg shadow-2xl hover:bg-slate-900 active:scale-95 transition-all"
                  >
                    Confirm & Send <ChevronRight size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-800">Ongoing Requests</h3>
                  <span className="w-5 h-5 bg-[#B2EBF2] text-[#00838F] flex items-center justify-center rounded-full text-[10px] font-bold">
                    {allOngoingRequests.length}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {currentRequests.length > 0 ? (
                  currentRequests.map((request) => (
                    <StatusCard
                      key={request.uniqueKey}
                      icon={request.icon}
                      title={request.service || request.category}
                      artisan={request.artisan}
                      status={request.status}
                      date={request.date}
                      action={request.action}
                    />
                  ))
                ) : (
                  <div className="p-10 border-2 border-dashed border-slate-100 rounded-[2rem] text-center">
                    <p className="text-slate-400 text-sm">No active requests.</p>
                  </div>
                )}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-xl border transition-all ${
                      currentPage === 1 ? 'text-slate-200 border-slate-50' : 'text-slate-600 border-slate-200 hover:bg-white shadow-sm'
                    }`}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-xl border transition-all ${
                      currentPage === totalPages ? 'text-slate-200 border-slate-50' : 'text-slate-600 border-slate-200 hover:bg-white shadow-sm'
                    }`}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-20">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Artisans Near You</h2>
              <p className="text-xs text-slate-400 font-medium">48 verified professionals available in your area</p>
            </div>
            <button
              onClick={() => router.push('/artisan/dashboard')}
              className="text-[#2D6A6A] font-bold text-xs hover:underline"
            >
              View All
            </button>
          </div>
          <div className="relative h-[450px] rounded-[2.5rem] border border-slate-200 shadow-lg overflow-hidden">
            <ArtisansMap />
          </div>
        </div>
      </div>
    </div>
  )
}
