"use client";

import { motion } from "framer-motion";
import { Bell, Check, Trash2 } from "lucide-react";

export default function NotificationItem({ notification, index, onRead, onDelete, isReadPending, isDeletePending }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.03 }}
      className={`group relative flex items-start gap-3 border-b border-slate-50 px-4 py-3.5 transition-colors hover:bg-slate-50 sm:px-5 sm:py-4 ${!notification.isRead ? "bg-emerald-50/30" : ""}`}
    >
      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${notification.isRead ? "bg-slate-100" : "bg-emerald-100"}`}>
        <Bell size={14} className={notification.isRead ? "text-slate-400" : "text-emerald-600"} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-sm leading-snug ${notification.isRead ? "text-slate-500" : "font-semibold text-slate-700"}`}>
          {notification.message || notification.title || "Notification"}
        </p>
        {notification.createdAt && (
          <p className="mt-1 text-[11px] text-slate-400">
            {new Date(notification.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        )}
      </div>
      <div className="flex shrink-0 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!notification.isRead && (
          <button onClick={() => onRead(notification.id)} disabled={isReadPending} className="rounded-lg p-1.5 text-emerald-500 transition-colors hover:bg-emerald-50" title="Mark as read">
            <Check size={13} />
          </button>
        )}
        <button onClick={() => onDelete(notification.id)} disabled={isDeletePending} className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-50" title="Delete">
          <Trash2 size={13} />
        </button>
      </div>
    </motion.div>
  );
}
