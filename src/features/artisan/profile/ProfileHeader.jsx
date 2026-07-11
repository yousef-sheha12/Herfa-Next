"use client";

import { motion } from "framer-motion";
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 pt-28 pb-12 sm:pt-32 sm:pb-16 md:pt-40 md:pb-20 flex flex-col md:flex-row items-center gap-8 sm:gap-12 md:gap-16">
      <motion.div
        className="relative shrink-0"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-56 md:h-56 rounded-full overflow-hidden border-[1px] border-slate-100 shadow-2xl relative group bg-slate-50">
          <img src={artisan.avatar} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Artisan Avatar" />
        </div>
        <div className="absolute bottom-2 right-4 sm:right-6 p-2 sm:p-2.5 bg-cyan-400 text-white rounded-full border-4 border-white shadow-lg">
          <ShieldCheck size={18} className="fill-white/20 sm:w-5 sm:h-5" />
        </div>
      </motion.div>

      <motion.div
        className="flex-1 flex flex-col gap-6 sm:gap-8 text-center md:text-left"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4">
            <span className="px-4 py-1 bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full sm:px-5">{artisan.role}</span>
            <div className="flex items-center gap-1 text-emerald-500 font-bold">
              <Star size={16} className="fill-emerald-500" />
              <span className="text-base font-black">{artisan.rating}</span>
              <span className="text-slate-300 font-medium text-sm ml-1">({artisan.reviews} reviews)</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 tracking-[-0.05em]">{artisan.name}</h1>
          <p className="text-slate-500 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl font-medium tracking-tight">{artisan.bio}</p>
        </div>

        <div className="flex gap-4 justify-center md:justify-start">
          <StatBox label="Projects" value={artisan.completedJobs} />
          <StatBox label="Verified" value={artisan.verifiedStatus} />
        </div>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
          {isArtisan ? (
            <motion.button onClick={() => handleNav("/artisan/edit-profile")}
              className="flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-full font-black text-[12px] uppercase tracking-widest shadow-2xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all sm:px-10 sm:py-5 sm:text-[13px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Pencil size={20} /> <span>Edit Profile</span>
            </motion.button>
          ) : (
            <motion.button onClick={() => handleNav("/booking")}
              className="flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-full font-black text-[12px] uppercase tracking-widest shadow-2xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all sm:px-10 sm:py-5 sm:text-[13px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap size={22} className="fill-white/20" /> <span>Request Service</span>
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
