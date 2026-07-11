"use client";

import { motion } from "framer-motion";
import { Gift } from "lucide-react";

export default function HeroBanner({ userName }) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-[2rem] bg-[#F8F9FA] p-6 mb-8 border border-slate-100 shadow-sm sm:rounded-[2.5rem] sm:p-8 lg:p-12 lg:flex lg:justify-between lg:items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative z-10 flex flex-col gap-3 sm:gap-4 max-w-xl">
        <div className="px-3 py-1 bg-[#FDEBD0] text-[#D4AC0D] text-[10px] flex items-center gap-2 font-bold uppercase tracking-widest rounded-md w-fit">
          <Gift size={12} /> YOUR SANCTUARY
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A] sm:text-3xl lg:text-4xl xl:text-5xl leading-tight">
          Expert care for the <br className="hidden sm:block" /> home you love, {userName}.
        </h1>
        <p className="text-slate-500 font-medium leading-relaxed text-sm max-w-md sm:text-base">
          Book handpicked artisans for everything from artisan carpentry to essential plumbing, all within your neighborhood.
        </p>
      </div>
      <div className="hidden lg:block w-72 h-64 relative shrink-0">
        <img src="/images/hero-bg.png" alt="Herfa Home Care" className="w-full h-full object-cover rounded-[2rem] shadow-xl border-[8px] border-white" />
      </div>
    </motion.div>
  );
}
