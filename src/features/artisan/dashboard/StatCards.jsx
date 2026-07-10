"use client";

import { Wallet, CheckCircle2, LineChart } from "lucide-react";

const cardDefs = [
  { title: "Today's Earnings", suffix: "AED", note: "+12%", key: "earnings", icon: Wallet },
  { title: "Completed Jobs", suffix: "Total", note: "On Schedule", key: "completed", icon: CheckCircle2 },
  { title: "Avg Rating", suffix: "/ 5", note: "Trending Up", key: "rating", icon: LineChart },
];

export default function StatCards({ earnings, stats, isLoading }) {
  const values = {
    earnings: earnings?.today?.toFixed(2) || "0.00",
    completed: stats?.completedJobs?.toString() || "0",
    rating: stats?.averageRating?.toFixed(1) || "0.0",
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cardDefs.map((card) => {
        const Icon = card.icon;
        return (
          <article key={card.key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <Icon size={22} />
              </div>
              <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold text-teal-700">
                {isLoading ? "..." : card.note}
              </span>
            </div>
            <p className="mt-6 text-xs text-slate-500">{card.title}</p>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-3xl font-black text-slate-900">{values[card.key]}</span>
              <span className="pb-1 text-xs font-semibold text-slate-400">{card.suffix}</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
