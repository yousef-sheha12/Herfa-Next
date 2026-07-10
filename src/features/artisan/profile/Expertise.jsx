"use client";

export default function Expertise({ artisan }) {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-24 py-24 mb-20 text-center flex flex-col items-center gap-16">
      <div className="flex flex-col gap-3">
        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">What I do</span>
        <h2 className="text-5xl font-black text-slate-800 tracking-[-0.03em]">Expertise & Services</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {(artisan.expertise || []).map((exp) => {
          const Icon = exp.icon;
          return (
            <div key={exp.title} className="bg-white p-10 rounded-[3rem] border border-slate-100 flex flex-col items-center md:items-start text-center md:text-left gap-8 hover:-translate-y-2 transition-all group">
              <div className="p-5 rounded-[1.8rem] bg-cyan-50 text-cyan-500 shadow-sm transition-transform group-hover:rotate-6"><Icon size={28} /></div>
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold text-slate-800">{exp.title}</h3>
                <p className="text-slate-500 text-base leading-relaxed font-medium">{exp.desc}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 w-full flex justify-between items-center">
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{exp.price}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
