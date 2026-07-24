"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useGetNotifications, useGetUnreadNotifications, useReadNotification, useReadAllNotifications, useDeleteNotification, useClearAllNotifications } from "@/hooks/notifications/useNotifications";
import { CheckCheck, Trash2, X, Loader2, BellOff } from "lucide-react";
import NotificationItem from "./NotificationItem";

export default function NotificationPanel({ onClose }) {
  const [tab, setTab] = useState("all");
  const { data: notifications, isLoading } = useGetNotifications();
  const { data: unreadData } = useGetUnreadNotifications();
  const readNotification = useReadNotification();
  const readAll = useReadAllNotifications();
  const deleteNotification = useDeleteNotification();
  const clearAll = useClearAllNotifications();

  const unreadCount = Array.isArray(unreadData) ? unreadData.length : unreadData?.length ?? 0;
  const allNotifications = Array.isArray(notifications) ? notifications : [];
  const items = tab === "unread" ? allNotifications.filter((n) => !n.isRead) : allNotifications;

  return (
    <div className="w-[320px] sm:w-[360px] max-h-[420px] sm:max-h-[480px] flex flex-col rounded-3xl border border-gray-100 bg-white shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 sm:px-5 sm:py-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
          {unreadCount > 0 && <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-500 px-1.5 text-[10px] font-bold text-white">{unreadCount}</span>}
        </div>
        <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"><X size={16} /></button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 px-4 sm:px-5 pt-3 gap-1">
        {["all", "unread"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-t-xl px-3 py-2 text-xs font-bold transition-colors sm:px-4 ${tab === t ? "bg-emerald-50 text-emerald-600" : "text-slate-400 hover:text-slate-600"}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
        <div className="ml-auto flex gap-1 pb-1">
          {unreadCount > 0 && <button onClick={() => readAll.mutate()} disabled={readAll.isPending} className="rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-emerald-600 transition-colors hover:bg-emerald-50" title="Mark all as read"><CheckCheck size={14} /></button>}
          {items.length > 0 && <button onClick={() => clearAll.mutate()} disabled={clearAll.isPending} className="rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-red-500 transition-colors hover:bg-red-50" title="Clear all"><Trash2 size={14} /></button>}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-10"><Loader2 size={24} className="animate-spin text-emerald-500" /></div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-slate-400"><BellOff size={32} /><p className="text-sm font-medium">No notifications</p></div>
        ) : (
          <AnimatePresence>
            {items.map((n, i) => (
              <NotificationItem key={n.id} notification={n} index={i} onRead={(id) => readNotification.mutate(id)} onDelete={(id) => deleteNotification.mutate(id)} isReadPending={readNotification.isPending} isDeletePending={deleteNotification.isPending} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
