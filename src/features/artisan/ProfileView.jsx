'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Star,
  ShieldCheck,
  Briefcase,
  Zap,
  Award,
  ArrowUpRight,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const mockArtisans = [
  {
    id: 1,
    name: 'David K.',
    role: 'MASTER PLUMBER',
    rating: 4.9,
    reviews: 124,
    experience: '15+ Years',
    responseTime: '< 2 Hours',
    completedJobs: '1.2k+',
    verifiedStatus: 'Herfa Pro',
    bio: 'With over 15 years of dedicated experience in residential and commercial plumbing, I specialize in intricate water systems, luxury kitchen installations, and sustainable plumbing solutions. My mission is to provide artisanal-grade precision to every home sanctuary I enter.',
    portfolio: [
      { id: 1, image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=2000&auto=format&fit=crop', size: 'large' },
      { id: 2, image: 'https://images.unsplash.com/photo-1504148455328-c39695715583?q=80&w=2000&auto=format&fit=crop', size: 'small' },
      { id: 3, image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2000&auto=format&fit=crop', size: 'small' },
    ],
    expertise: [
      { title: 'System Design', desc: 'Complete water and drainage system blueprints for new builds and extensive renovations.', price: 'From $150/hr', icon: Zap },
      { title: 'Luxury Fixtures', desc: 'Specialized installation for designer faucets, rainfall showers, and smart home water systems.', price: 'Project Based', icon: Briefcase },
      { title: 'Emergency Care', desc: 'Priority response for leaks, pipe bursts, and critical system failures to protect your home.', price: '24/7 Availability', icon: Award },
    ],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2000&auto=format&fit=crop',
  },
]

const fallbackArtisan = mockArtisans[0]

export default function ProfileView({ id }) {
  const [artisan, setArtisan] = useState(null)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const isArtisan = user?.role === 'artisan'

  useEffect(() => {
    const found = mockArtisans.find((a) => a.id === Number(id))
    setArtisan(found || fallbackArtisan)
  }, [id])

  const handleProtectedNavigation = (path) => {
    if (!isAuthenticated) {
      router.push(`/auth/login?from=${encodeURIComponent(window.location.pathname)}`)
      return
    }
    router.push(path)
  }

  if (!artisan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-24 pt-40 pb-20 flex flex-col md:flex-row items-center gap-16">
        <div className="relative shrink-0">
          <div className="w-56 h-56 rounded-full overflow-hidden border-[1px] border-slate-100 shadow-2xl relative group bg-slate-50">
            <img
              src={artisan.avatar}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              alt="Artisan Avatar"
            />
          </div>
          <div className="absolute bottom-2 right-6 p-2.5 bg-cyan-400 text-white rounded-full border-4 border-white shadow-lg">
            <ShieldCheck size={20} className="fill-white/20" />
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-8 text-center md:text-left">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <span className="px-5 py-1 bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                {artisan.role}
              </span>
              <div className="flex items-center gap-1 text-emerald-500 font-bold">
                <Star size={16} className="fill-emerald-500" />
                <span className="text-base font-black">{artisan.rating}</span>
                <span className="text-slate-300 font-medium text-sm ml-1">
                  ({artisan.reviews} reviews)
                </span>
              </div>
            </div>
            <h1 className="text-6xl font-black text-slate-800 tracking-[-0.05em]">
              {artisan.name}
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed max-w-3xl font-medium tracking-tight">
              {artisan.bio}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatBox label="Experience" value={artisan.experience} />
            <StatBox label="Response Time" value={artisan.responseTime} />
            <StatBox label="Projects" value={artisan.completedJobs} />
            <StatBox label="Verified" value={artisan.verifiedStatus} />
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
            {isArtisan ? (
              <button
                className="flex items-center gap-3 px-10 py-5 bg-slate-200 text-slate-700 rounded-full font-bold text-sm uppercase tracking-widest shadow-sm hover:bg-slate-300 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                <Zap size={22} className="fill-slate-400" />
                <span>Your Profile</span>
              </button>
            ) : (
              <button
                onClick={() => handleProtectedNavigation('/booking')}
                className="flex items-center gap-3 px-10 py-5 bg-emerald-600 text-white rounded-full font-black text-[13px] uppercase tracking-widest shadow-2xl shadow-emerald-500/20 hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all group"
              >
                <Zap size={22} className="fill-white/20" />
                <span>Request Service</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-24 py-20 border-t border-slate-100 mt-10">
        <div className="flex items-center justify-between mb-12">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              Portfolio of Work
            </h2>
            <p className="text-slate-400 font-medium">
              A curated selection of {artisan.name.split(' ')[0]}&apos;s recent high-end {artisan.role.replace('MASTER ', '').toLowerCase()} projects.
            </p>
          </div>
          <button className="text-emerald-600 font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:translate-x-2 transition-transform">
            View all projects <ArrowUpRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[600px]">
          <div className="lg:col-span-8 rounded-[2.5rem] overflow-hidden group shadow-2xl relative">
            <img
              src={artisan.portfolio[0].image}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              alt=""
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>
          <div className="lg:col-span-4 flex flex-col gap-8 h-full">
            <div className="flex-1 rounded-[2.5rem] overflow-hidden group shadow-xl">
              <img
                src={artisan.portfolio[1].image}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                alt=""
              />
            </div>
            <div className="flex-1 rounded-[2.5rem] overflow-hidden group shadow-xl relative">
              <img
                src={artisan.portfolio[2].image}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                alt=""
              />
              <div className="absolute top-6 right-6 px-4 py-1.5 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                New Project
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-24 py-24 mb-20 text-center flex flex-col items-center gap-16">
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">
            What I do
          </span>
          <h2 className="text-5xl font-black text-slate-800 tracking-[-0.03em]">
            Expertise & Services
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {artisan.expertise.map((exp) => {
            const Icon = exp.icon
            return (
              <div
                key={exp.title}
                className="bg-white p-10 rounded-[3rem] border border-slate-100 flex flex-col items-center md:items-start text-center md:text-left gap-8 hover:-translate-y-2 transition-all group"
              >
                <div className="p-5 rounded-[1.8rem] bg-cyan-50 text-cyan-500 shadow-sm transition-transform group-hover:rotate-6">
                  <Icon size={28} />
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-xl font-bold text-slate-800">
                    {exp.title}
                  </h3>
                  <p className="text-slate-500 text-base leading-relaxed font-medium">
                    {exp.desc}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50 w-full flex justify-between items-center">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                    {exp.price}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value }) {
  return (
    <div className="bg-white p-6 rounded-[1.8rem] border border-slate-100 shadow-sm flex flex-col gap-1 items-center md:items-start group hover:border-emerald-500/20 transition-all">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-emerald-500/50 transition-colors">
        {label}
      </span>
      <span className="text-lg font-bold text-slate-800 tracking-tight">
        {value}
      </span>
    </div>
  )
}
