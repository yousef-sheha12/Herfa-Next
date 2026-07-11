"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetNotifications,
  useGetUnreadNotifications,
  useReadNotification,
  useReadAllNotifications,
  useDeleteNotification,
  useClearAllNotifications,
} from "@/hooks/notifications/useNotifications";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  X,
  Loader2,
  BellOff,
} from "lucide-react";

export default function NotificationPanel({ onClose }) {
  const [tab, setTab] = useState("all");
  const { data: notifications, isLoading } = useGetNotifications();
  const { data: unreadData } = useGetUnreadNotifications();
  const readNotification = useReadNotification();
  const readAll = useReadAllNotifications();
  const deleteNotification = useDeleteNotification();
  const clearAll = useClearAllNotifications();

  const unreadCount = Array.isArray(unreadData) ? unreadData.length : unreadData?.length ?? 0;

  const items = tab === "unread"
    ? (Array.isArray(notifications) ? notifications : []).filter((n) => !n.isRead)
    : (Array.isArray(notifications) ? notifications : []);

  const handleMarkAllRead = () => {
    readAll.mutate();
  };

  const handleClearAll = () => {
    clearAll.mutate();
  };

  const handleReadOne = (id) => {
    readNotification.mutate(id);
  };

  const handleDeleteOne = (id) => {
    deleteNotification.mutate(id);
  };

  return (
    <div className="w-[320px] sm:w-[360px] max-h-[420px] sm:max-h-[480px] flex flex-col rounded-3xl border border-gray-100 bg-white shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 sm:px-5 sm:py-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
          {unreadCount > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-500 px-1.5 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
        <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="flex border-b border-slate-100 px-4 sm:px-5 pt-3 gap-1">
        <button
          onClick={() => setTab("all")}
          className={`rounded-t-xl px-3 py-2 text-xs font-bold transition-colors sm:px-4 ${
            tab === "all"
              ? "bg-emerald-50 text-emerald-600"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setTab("unread")}
          className={`rounded-t-xl px-3 py-2 text-xs font-bold transition-colors sm:px-4 ${
            tab === "unread"
              ? "bg-emerald-50 text-emerald-600"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Unread
        </button>

        <div className="ml-auto flex gap-1 pb-1">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={readAll.isPending}
              className="rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-emerald-600 transition-colors hover:bg-emerald-50"
              title="Mark all as read"
            >
              <CheckCheck size={14} />
            </button>
          )}
          {items.length > 0 && (
            <button
              onClick={handleClearAll}
              disabled={clearAll.isPending}
              className="rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-red-500 transition-colors hover:bg-red-50"
              title="Clear all"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={24} className="animate-spin text-emerald-500" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-slate-400">
            <BellOff size={32} />
            <p className="text-sm font-medium">No notifications</p>
          </div>
        ) : (
          <AnimatePresence>
            {items.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.03 }}
                className={`group relative flex items-start gap-3 border-b border-slate-50 px-4 py-3.5 transition-colors hover:bg-slate-50 sm:px-5 sm:py-4 ${
                  !notification.isRead ? "bg-emerald-50/30" : ""
                }`}
              >
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  notification.isRead ? "bg-slate-100" : "bg-emerald-100"
                }`}>
                  <Bell size={14} className={notification.isRead ? "text-slate-400" : "text-emerald-600"} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm leading-snug ${
                    notification.isRead ? "text-slate-500" : "font-semibold text-slate-700"
                  }`}>
                    {notification.message || notification.title || "Notification"}
                  </p>
                  {notification.createdAt && (
                    <p className="mt-1 text-[11px] text-slate-400">
                      {new Date(notification.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notification.isRead && (
                    <button
                      onClick={() => handleReadOne(notification.id)}
                      disabled={readNotification.isPending}
                      className="rounded-lg p-1.5 text-emerald-500 transition-colors hover:bg-emerald-50"
                      title="Mark as read"
                    >
                      <Check size={13} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteOne(notification.id)}
                    disabled={deleteNotification.isPending}
                    className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
