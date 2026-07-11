'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
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
        <motion.img
          src="/images/hero-bg.png"
          alt="Craftsman working"
          className="h-full w-full object-cover opacity-90"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-slate-950/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/15 via-slate-950/10 to-[#f7f4ef]" />
      </div>

      <div className="relative mx-auto flex min-h-[500px] max-w-7xl flex-col items-center justify-center px-4 pb-16 pt-24 text-center sm:min-h-[620px] sm:px-6 md:min-h-[700px] md:px-10 lg:px-12 lg:pb-28">
        <motion.span
          className="mb-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-white/80 sm:mb-6 sm:text-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Trusted Home Services
        </motion.span>

        <motion.h1
          className="max-w-3xl text-3xl font-black leading-[1.05] tracking-[-0.05em] text-white sm:text-4xl md:text-5xl lg:text-7xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Your Home,
          <br />
          Perfected by
          <br />
          <span className="text-emerald-500 italic">Experts</span>
        </motion.h1>

        <motion.p
          className="mt-6 max-w-2xl text-sm leading-7 text-white/80 sm:mt-8 md:text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Discover the finest artisans and home professionals tailored for your needs, reliability, and exceptional care.
        </motion.p>

        <motion.div
          className="mt-8 flex w-full max-w-2xl flex-col gap-3 rounded-[2rem] bg-white/92 p-2 shadow-[0_30px_80px_rgba(15,23,42,0.22)] backdrop-blur sm:mt-10 sm:p-3 md:flex-row md:items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          <div className="flex flex-1 items-center gap-3 rounded-full bg-slate-50 px-4 py-3 text-left text-slate-500 sm:px-5 sm:py-4">
            <Search size={18} className="text-slate-400 shrink-0" />
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
          <motion.button
            onClick={handleSearch}
            className="rounded-full bg-teal-700 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-teal-800 sm:px-8 sm:py-4"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Search
          </motion.button>
        </motion.div>

        <motion.div
          className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.button
                key={category.id || category.name}
                onClick={() => onCategoryClick(category)}
                className={`rounded-full px-3 py-2 text-xs font-semibold shadow-sm transition sm:px-5 sm:py-2.5 sm:text-sm ${
                  category.name === 'View All'
                    ? 'bg-sky-100 text-sky-700 hover:bg-sky-200'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1 + index * 0.08 }}
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center gap-1.5 sm:gap-2">
                  {typeof Icon === 'string' ? (
                    <img src={Icon} alt="" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  ) : (
                    <Icon size={14} strokeWidth={2.4} className="sm:w-[15px] sm:h-[15px]" />
                  )}
                  <span>{category.name}</span>
                </span>
              </motion.button>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
