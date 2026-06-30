'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

export default function Hero({ categories = [], onCategoryClick, onSearchClick }) {
  const [searchValue, setSearchValue] = useState('')

  const handleSearch = () => {
    if (searchValue.trim()) {
      onSearchClick(searchValue.trim())
    }
  }

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/images/hero-bg.png"
          alt="Craftsman working"
          className="h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-slate-950/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/15 via-slate-950/10 to-[#f7f4ef]" />
      </div>

      <div className="relative mx-auto flex min-h-[620px] max-w-7xl flex-col items-center justify-center px-4 pb-20 pt-24 text-center sm:px-6 md:min-h-[700px] md:px-10 lg:px-12 lg:pb-28">
        <span className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
          Trusted Home Services
        </span>

        <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-[-0.05em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Your Home,
          <br />
          Perfected by
          <br />
          <span className="text-emerald-500 italic">Experts</span>
        </h1>

        <p className="mt-8 max-w-2xl text-sm leading-7 text-white/80 md:text-base">
          Discover the finest artisans and home professionals tailored for your needs, reliability, and exceptional care.
        </p>

        <div className="mt-10 flex w-full max-w-2xl flex-col gap-3 rounded-[2rem] bg-white/92 p-2 shadow-[0_30px_80px_rgba(15,23,42,0.22)] backdrop-blur sm:p-3 md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-3 rounded-full bg-slate-50 px-4 py-3 text-left text-slate-500 sm:px-5 sm:py-4">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSearch()
                }
              }}
              placeholder="What service do you need today?"
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:text-[15px]"
            />
          </div>
          <button
            onClick={handleSearch}
            className="rounded-full bg-teal-700 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-teal-800 sm:px-8 sm:py-4"
          >
            Search
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.label}
                onClick={() => onCategoryClick(category)}
                className={`rounded-full px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 sm:px-5 ${
                  category.label === 'View All'
                    ? 'bg-sky-100 text-sky-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon size={15} strokeWidth={2.4} />
                  <span>{category.label}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
