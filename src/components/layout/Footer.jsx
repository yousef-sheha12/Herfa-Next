'use client'

import { motion } from 'framer-motion'
import { Hammer } from 'lucide-react'
import { FaLinkedin, FaTwitter } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function Footer() {
  const router = useRouter()

  return (
    <ScrollReveal>
      <footer className="w-full border-t border-gray-100 bg-gray-50 px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-10 md:flex-row md:items-start">
          <div
            className="group flex flex-col items-center gap-3 text-center md:items-start md:text-left cursor-pointer"
            onClick={() => router.push('/')}
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-slate-800 text-white shadow-lg shadow-emerald-500/20">
                <Hammer size={23} />
              </span>
              <span className="text-2xl font-bold text-emerald-600 tracking-[-0.05em] uppercase sm:text-3xl">
                Herfa
              </span>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.1em]">
              &copy; 2026 Herfa Platform <span className="mx-2">&bull;</span> All Rights Reserved
            </p>
          </div>

          <div className="flex max-w-xl flex-wrap justify-center mt-5 gap-x-6 gap-y-4 text-[10px] uppercase tracking-[0.1em] text-slate-500">
            <a href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Help Center</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Careers</a>
          </div>

          <div className="flex gap-4">
            <SocialIcon Icon={FaTwitter} />
            <SocialIcon Icon={FaLinkedin} />
          </div>
        </div>
      </footer>
    </ScrollReveal>
  )
}

function SocialIcon({ Icon }) {
  return (
    <motion.div
      className="group flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-gray-100 bg-white text-slate-400 shadow-sm transition-all duration-500 hover:bg-emerald-500 hover:text-white"
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.9 }}
    >
      <Icon size={16} className="group-hover:scale-110 transition-transform" />
    </motion.div>
  )
}
