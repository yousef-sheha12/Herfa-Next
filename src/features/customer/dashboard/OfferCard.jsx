"use client";

import { motion } from "framer-motion";
import { Check, X, Loader2 } from "lucide-react";

function getInitials(name) {
  if (!name) return "??";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function formatRelativeTime(dateString) {
  if (!dateString) return "";
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function OfferCard({ offer, requestTitle, onAccept, onReject, isProcessing }) {
  const artisanName = offer.artisanName || offer.artisan?.username || offer.Artisan?.UserName || "Artisan";
  const price = offer.price || offer.Price || 0;
  const message = offer.message || offer.Message || "";
  const status = (offer.status || offer.Status || "").toLowerCase();

  const isAccepted = status === "accepted";
  const isRejected = status === "rejected";
  const isPending = status === "pending" || status === "open" || !status;

  return (
    <motion.article
      className={`rounded-2xl border bg-white p-4 shadow-sm sm:p-5 transition-colors ${
        isAccepted ? "border-emerald-200 bg-emerald-50/30" :
        isRejected ? "border-red-200 bg-red-50/30" :
        "border-slate-100 hover:border-teal-100"
      }`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {getInitials(artisanName)}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-900 truncate">{artisanName}</h4>
            <p className="text-[10px] text-slate-400 truncate">For: {requestTitle || "Request"}</p>
          </div>
        </div>
        <span className="text-[9px] font-bold text-slate-300 uppercase shrink-0 ml-2">
          {formatRelativeTime(offer.createdAt)}
        </span>
      </div>

      <p className="text-xs leading-relaxed text-slate-600 mb-3">{message}</p>

      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
        <div className="text-lg font-black text-teal-700">
          ${price}
        </div>

        {isPending && (
          <div className="flex gap-2">
            <motion.button
              onClick={() => onAccept(offer.id)}
              disabled={isProcessing}
              className="flex items-center gap-1.5 bg-teal-600 text-white px-4 py-2 rounded-xl text-[10px] font-bold hover:bg-teal-700 disabled:opacity-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isProcessing ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
              Accept
            </motion.button>
            <motion.button
              onClick={() => onReject(offer.id)}
              disabled={isProcessing}
              className="flex items-center gap-1.5 border border-slate-200 text-slate-500 px-4 py-2 rounded-xl text-[10px] font-bold hover:bg-slate-50 disabled:opacity-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X size={12} />
              Reject
            </motion.button>
          </div>
        )}

        {isAccepted && (
          <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase">
            Accepted
          </span>
        )}

        {isRejected && (
          <span className="px-3 py-1.5 bg-red-100 text-red-600 rounded-full text-[10px] font-bold uppercase">
            Rejected
          </span>
        )}
      </div>
    </motion.article>
  );
}
