"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Loader2, Plus } from "lucide-react";
import RequestCard from "./RequestCard";

export default function RequestList({
  requests,
  isLoading,
  onAccept,
  onReject,
  isAccepting,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 3;

  const pending = useMemo(
    () => (Array.isArray(requests) ? requests : []),
    [requests],
  );
  const totalPages = Math.ceil(pending.length / perPage);
  const page = useMemo(
    () => pending.slice((currentPage - 1) * perPage, currentPage * perPage),
    [pending, currentPage],
  );

  return (
    <aside className="flex flex-col gap-6 lg:col-span-4">
      <div className="flex items-center justify-between px-1">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-700">
          Incoming Requests
        </p>
        <span className="bg-rose-50 text-rose-500 px-2.5 py-1 rounded-full text-[10px] font-bold">
          {pending.length} New
        </span>
      </div>

      <div className="flex flex-col gap-4 min-h-[420px]">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          </div>
        ) : page.length > 0 ? (
          page.map((r) => (
            <RequestCard
              key={r.id}
              request={r}
              onAccept={onAccept}
              onReject={onReject}
              isPending={isAccepting}
            />
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-slate-400 text-sm">No matching requests.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-2 bg-slate-50 rounded-2xl mx-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className={`p-1.5 rounded-lg ${currentPage === 1 ? "text-slate-300" : "text-slate-600 hover:bg-white shadow-sm"}`}
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-[10px] font-black text-slate-400">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className={`p-1.5 rounded-lg ${currentPage === totalPages ? "text-slate-300" : "text-slate-600 hover:bg-white shadow-sm"}`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </aside>
  );
}
