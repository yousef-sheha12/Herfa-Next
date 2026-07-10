"use client";

import { ArrowUpRight } from "lucide-react";

export default function Portfolio({ artisan }) {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-24 py-20 border-t border-slate-100 mt-10">
      <div className="flex items-center justify-between mb-12">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Portfolio of Work</h2>
          <p className="text-slate-400 font-medium">
            A curated selection of {artisan.name?.split(" ")[0]}&apos;s recent projects.
          </p>
        </div>
        <button className="text-emerald-600 font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:translate-x-2 transition-transform">
          View all projects <ArrowUpRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[600px]">
        <div className="lg:col-span-8 rounded-[2.5rem] overflow-hidden group shadow-2xl relative">
          <img src={artisan.portfolio?.[0]?.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="" />
          <div className="absolute inset-0 bg-black/10" />
        </div>
        <div className="lg:col-span-4 flex flex-col gap-8 h-full">
          <div className="flex-1 rounded-[2.5rem] overflow-hidden group shadow-xl">
            <img src={artisan.portfolio?.[1]?.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
          </div>
          <div className="flex-1 rounded-[2.5rem] overflow-hidden group shadow-xl relative">
            <img src={artisan.portfolio?.[2]?.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
            <div className="absolute top-6 right-6 px-4 py-1.5 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">New Project</div>
          </div>
        </div>
      </div>
    </div>
  );
}
