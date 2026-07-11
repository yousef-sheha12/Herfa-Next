'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

export default function ArtisanCard({
  id,
  name,
  role,
  rating,
  jobs,
  image,
  variant = 'compact',
  onBookNow,
  onViewProfile,
}) {
  const artisan = { id, name, role, rating, jobs, image }

  const handleProfileClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onViewProfile) onViewProfile(e, artisan)
  }

  if (variant === 'featured') {
    return (
      <motion.article
        className="overflow-hidden rounded-[1.2rem] bg-white shadow-sm"
        whileHover={{ y: -4, boxShadow: "0 20px 50px rgba(0,0,0,0.1)" }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative h-[280px] sm:h-[320px] lg:h-[420px]">
          <img
            onClick={handleProfileClick}
            src={image}
            alt={name}
            className="h-full w-full cursor-pointer object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent pointer-events-none" />

          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-start gap-4 p-4 sm:p-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="text-white">
              <span className="mb-3 inline-flex rounded-full bg-teal-600/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em]">
                {role}
              </span>
              <h3 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">{name}</h3>
              <div className="mt-2 flex items-center gap-2 text-sm text-white/85">
                <Star size={15} className="fill-amber-400 text-amber-400" />
                <span>{rating}</span>
                <span>{jobs}</span>
              </div>
            </div>

            <motion.button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (onBookNow) onBookNow(e, artisan)
              }}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-teal-700 transition hover:bg-slate-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book Now
            </motion.button>
          </div>
        </div>
      </motion.article>
    )
  }

  return (
    <motion.article
      className="flex flex-col gap-4 rounded-[1.2rem] bg-white p-4 shadow-sm sm:flex-row sm:items-center"
      whileHover={{ y: -3, boxShadow: "0 15px 40px rgba(0,0,0,0.08)" }}
      transition={{ duration: 0.3 }}
    >
      <div className="overflow-hidden rounded-2xl sm:w-24 sm:shrink-0">
        <img
          onClick={handleProfileClick}
          src={image}
          alt={name}
          className="h-48 w-full cursor-pointer rounded-2xl object-cover transition-transform duration-500 hover:scale-110 sm:h-24 sm:w-24"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-slate-900">{name}</h3>
        <p className="mt-1 text-xs font-semibold text-slate-500">{role}</p>
        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
          <Star size={14} className="fill-amber-400 text-amber-400" />
          <span>{rating}</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={handleProfileClick}
            className="text-sm font-bold text-teal-700 transition hover:text-teal-900"
          >
            View Profile
          </button>
          <motion.button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (onBookNow) onBookNow(e, artisan)
            }}
            className="rounded-full bg-emerald-800 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-500 sm:px-5 sm:py-2.5 sm:text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Book Now
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}
