"use client";

import { motion } from "framer-motion";
import { Calendar, Hammer, Droplet, Zap, PaintBucket, Wrench } from "lucide-react";

const iconMap = { carpentry: Hammer, plumbing: Droplet, electrical: Zap, painting: PaintBucket, general: Wrench, maintenance: Wrench };

const statusColors = {
  accepted: { iconBg: "bg-[#FDF2E9]", iconText: "text-[#E67E22]", badge: "bg-[#EBF5FB] text-[#2E86C1]" },
  pending: { iconBg: "bg-[#E1F5FE]", iconText: "text-[#01579B]", badge: "bg-[#FEF9E7] text-[#F1C40F]" },
  open: { iconBg: "bg-[#E1F5FE]", iconText: "text-[#01579B]", badge: "bg-[#FEF9E7] text-[#F1C40F]" },
  inProgress: { iconBg: "bg-[#E8F5E9]", iconText: "text-[#2ECC71]", badge: "bg-[#E8F5E9] text-[#2ECC71]" },
  in_progress: { iconBg: "bg-[#E8F5E9]", iconText: "text-[#2ECC71]", badge: "bg-[#E8F5E9] text-[#2ECC71]" },
  closed: { iconBg: "bg-[#FDEDEC]", iconText: "text-[#E74C3C]", badge: "bg-[#FDEDEC] text-[#E74C3C]" },
  cancelled: { iconBg: "bg-[#FDEDEC]", iconText: "text-[#E74C3C]", badge: "bg-[#FDEDEC] text-[#E74C3C]" },
};

export default function StatusCard({ icon, title, status, date, artisan }) {
  const normalizedStatus = status?.toLowerCase()?.replace(/\s+/g, "_") || "pending";
  const theme = statusColors[normalizedStatus] || statusColors.pending;
  const Icon = iconMap[icon?.toLowerCase()] || Wrench;
  const displayStatus = normalizedStatus === "in_progress" ? "in progress" : normalizedStatus;

  return (
    <motion.div
      className="bg-white p-4 rounded-3xl border border-slate-50 shadow-sm flex flex-col gap-4 sm:p-5 hover:shadow-md transition-shadow"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`p-3 rounded-2xl ${theme.iconBg} ${theme.iconText} shrink-0`}><Icon size={22} /></div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-800 truncate">{title}</h4>
            <p className="text-[10px] text-slate-400 font-medium truncate">Artisan: {artisan || "Matching..."}</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${theme.badge} shrink-0`}>{displayStatus}</span>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
          <Calendar size={12} /> <span>{date}</span>
        </div>
      </div>
    </motion.div>
  );
}
