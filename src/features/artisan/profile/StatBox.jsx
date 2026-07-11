"use client";

import { motion } from "framer-motion";

export default function StatBox({ label, value }) {
  return (
    <motion.div
      className="bg-white p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[1.8rem] border border-slate-100 shadow-sm flex flex-col gap-1 items-center md:items-start group hover:border-emerald-500/20 transition-all"
      whileHover={{ y: -2 }}
    >
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-emerald-500/50 transition-colors">{label}</span>
      <span className="text-lg font-bold text-slate-800 tracking-tight">{value}</span>
    </motion.div>
  );
}
