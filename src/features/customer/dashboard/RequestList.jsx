"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import StatusCard from "./StatusCard";

export default function RequestList({ requests, isLoading }) {
  const [page, setPage] = useState(1);
  const perPage = 5;

  const items = useMemo(() => {
    if (!Array.isArray(requests)) return [];
    return requests.filter((r) => {
      const s = (r.status || "").toLowerCase();
      return s === "pending" || s === "open" || s === "accepted" || s === "inprogress" || s === "in_progress" || s === "closed" || s === "cancelled";
    }).map((r, i) => ({
      ...r,
      icon: r.category || "general",
      title: r.title || r.description,
      uniqueKey: `${r.id}-${i}`,
      status: r.status || "pending",
      date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "",
    }));
  }, [requests]);

  const total = Math.ceil(items.length / perPage);
  const pageItems = items.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-slate-800">Ongoing Requests</h3>
          <span className="w-5 h-5 bg-[#B2EBF2] text-[#00838F] flex items-center justify-center rounded-full text-[10px] font-bold">
            {items.length}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-10">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
          </div>
        ) : pageItems.length > 0 ? (
          pageItems.map((r) => (
            <StatusCard key={r.uniqueKey} icon={r.icon} title={r.title} artisan={r.artisanName || "Matching..."} status={r.status} date={r.date} />
          ))
        ) : (
          <div className="p-10 border-2 border-dashed border-slate-100 rounded-[2rem] text-center">
            <p className="text-slate-400 text-sm">No active requests.</p>
          </div>
        )}
      </div>

      {total > 1 && (
        <div className="flex items-center justify-center gap-4 mt-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className={`p-2 rounded-xl border transition-all ${page === 1 ? "text-slate-200 border-slate-50" : "text-slate-600 border-slate-200 hover:bg-white shadow-sm"}`}>
            <ChevronLeft size={18} />
          </button>
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{page} / {total}</span>
          <button onClick={() => setPage((p) => Math.min(total, p + 1))} disabled={page === total}
            className={`p-2 rounded-xl border transition-all ${page === total ? "text-slate-200 border-slate-50" : "text-slate-600 border-slate-200 hover:bg-white shadow-sm"}`}>
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
