"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function Portfolio({ artisan }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 py-16 sm:py-20 border-t border-slate-100 mt-10">
      <ScrollReveal>
        <div className="flex items-center justify-between mb-10 sm:mb-12">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight sm:text-3xl">Portfolio of Work</h2>
            <p className="text-slate-400 font-medium text-sm sm:text-base">
              A curated selection of {artisan.name?.split(" ")[0]}&apos;s recent projects.
            </p>
          </div>
          <motion.button className="text-emerald-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:translate-x-2 transition-transform sm:text-sm hidden sm:flex">
            View all projects <ArrowUpRight size={18} />
          </motion.button>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 h-auto sm:h-[500px] lg:h-[600px]">
        <ScrollReveal direction="left" className="lg:col-span-8">
          <div className="rounded-[2rem] overflow-hidden group shadow-2xl relative h-[300px] sm:h-[400px] lg:h-full">
            <img src={artisan.portfolio?.[0]?.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="" />
            <div className="absolute inset-0 bg-black/10" />
          </div>
        </ScrollReveal>
        <div className="lg:col-span-4 flex flex-col gap-6 sm:gap-8 h-full">
          <ScrollReveal direction="right" delay={0.1} className="flex-1">
            <div className="rounded-[2rem] overflow-hidden group shadow-xl h-[250px] sm:h-[300px] lg:h-full">
              <img src={artisan.portfolio?.[1]?.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={0.2} className="flex-1">
            <div className="rounded-[2rem] overflow-hidden group shadow-xl relative h-[250px] sm:h-[300px] lg:h-full">
              <img src={artisan.portfolio?.[2]?.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 px-3 py-1.5 sm:px-4 sm:py-1.5 bg-orange-500 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">New Project</div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
