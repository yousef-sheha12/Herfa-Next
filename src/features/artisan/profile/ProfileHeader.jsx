"use client";

import { Star, ShieldCheck, Zap, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useApi";
import StatBox from "./StatBox";

export default function ProfileHeader({ artisan }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const isArtisan = user?.role === "artisan";

  const handleNav = (path) => {
    if (!isAuthenticated) {
      router.push(`/auth/login?from=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    router.push(path);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-24 pt-40 pb-20 flex flex-col md:flex-row items-center gap-16">
      <div className="relative shrink-0">
        <div className="w-56 h-56 rounded-full overflow-hidden border-[1px] border-slate-100 shadow-2xl relative group bg-slate-50">
          <img src={artisan.avatar} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Artisan Avatar" />
        </div>
        <div className="absolute bottom-2 right-6 p-2.5 bg-cyan-400 text-white rounded-full border-4 border-white shadow-lg">
          <ShieldCheck size={20} className="fill-white/20" />
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-8 text-center md:text-left">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <span className="px-5 py-1 bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">{artisan.role}</span>
            <div className="flex items-center gap-1 text-emerald-500 font-bold">
              <Star size={16} className="fill-emerald-500" />
              <span className="text-base font-black">{artisan.rating}</span>
              <span className="text-slate-300 font-medium text-sm ml-1">({artisan.reviews} reviews)</span>
            </div>
          </div>
          <h1 className="text-6xl font-black text-slate-800 tracking-[-0.05em]">{artisan.name}</h1>
          <p className="text-slate-500 text-lg leading-relaxed max-w-3xl font-medium tracking-tight">{artisan.bio}</p>
        </div>

        <div className="flex gap-4">
          <StatBox label="Projects" value={artisan.completedJobs} />
          <StatBox label="Verified" value={artisan.verifiedStatus} />
        </div>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
          {isArtisan ? (
            <button onClick={() => handleNav("/artisan/edit-profile")}
              className="flex items-center gap-3 px-10 py-5 bg-emerald-600 text-white rounded-full font-black text-[13px] uppercase tracking-widest shadow-2xl shadow-emerald-500/20 hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all group">
              <Pencil size={20} /> <span>Edit Profile</span>
            </button>
          ) : (
            <button onClick={() => handleNav("/booking")}
              className="flex items-center gap-3 px-10 py-5 bg-emerald-600 text-white rounded-full font-black text-[13px] uppercase tracking-widest shadow-2xl shadow-emerald-500/20 hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all group">
              <Zap size={22} className="fill-white/20" /> <span>Request Service</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
