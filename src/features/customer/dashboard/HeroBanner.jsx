"use client";

import { Gift } from "lucide-react";

export default function HeroBanner({ userName }) {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-[#F8F9FA] p-8 lg:p-12 border border-slate-100 flex justify-between items-center mb-8 shadow-sm">
      <div className="relative z-10 flex flex-col gap-4 max-w-xl">
        <div className="px-3 py-1 bg-[#FDEBD0] text-[#D4AC0D] text-[10px] flex items-center gap-2 font-bold uppercase tracking-widest rounded-md w-fit">
          <Gift size={12} /> YOUR SANCTUARY
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-[#1A1A1A] lg:text-5xl leading-tight">
          Expert care for the <br /> home you love, {userName}.
        </h1>
        <p className="text-slate-500 font-medium leading-relaxed text-base max-w-md">
          Book handpicked artisans for everything from artisan carpentry to essential plumbing, all within your neighborhood.
        </p>
      </div>
      <div className="hidden lg:block w-72 h-64 relative">
        <img src="/images/hero-bg.png" alt="Herfa Home Care" className="w-full h-full object-cover rounded-[2rem] shadow-xl border-[8px] border-white" />
      </div>
    </div>
  );
}
