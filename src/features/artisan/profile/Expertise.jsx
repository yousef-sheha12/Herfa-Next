"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";

export default function Expertise({ artisan }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 py-16 sm:py-24 mb-12 sm:mb-20 text-center flex flex-col items-center gap-12 sm:gap-16">
      <ScrollReveal>
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">What I do</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 tracking-[-0.03em]">Expertise & Services</h2>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full">
        {(artisan.expertise || []).map((exp, index) => {
          const Icon = exp.icon;
          return (
            <ScrollReveal key={exp.title} delay={index * 0.12}>
              <div className="bg-white p-6 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[3rem] border border-slate-100 flex flex-col items-center md:items-start text-center md:text-left gap-6 sm:gap-8 hover-lift group">
                <div className="p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[1.8rem] bg-cyan-50 text-cyan-500 shadow-sm transition-transform group-hover:rotate-6"><Icon size={26} className="sm:w-7 sm:h-7" /></div>
                <div className="flex flex-col gap-3 sm:gap-4">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800">{exp.title}</h3>
                  <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-medium">{exp.desc}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50 w-full flex justify-between items-center">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{exp.price}</span>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}
