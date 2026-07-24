"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, LayoutDashboard, Hammer, Menu, X, User, Settings, Bell } from "lucide-react";
import { useAuth } from "@/hooks/useApi";
import { useGetUnreadNotifications } from "@/hooks/notifications/useNotifications";
import NotificationPanel from "./NotificationPanel";

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const notifRef = useRef(null);
  const { data: unreadData } = useGetUnreadNotifications(isAuthenticated && user?.role === "artisan");
  const unreadCount = Array.isArray(unreadData) ? unreadData.length : (unreadData?.length ?? 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    if (showNotifications) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  useEffect(() => {
    document.body.style.overflow = showMobileMenu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showMobileMenu]);

  const getDashboardPath = () => user?.role === "artisan" ? "/artisan/dashboard" : "/customer/dashboard";

  const navigate = (path) => {
    router.push(path);
    setShowMobileMenu(false);
    setShowDropdown(false);
    setShowNotifications(false);
  };

  const handleLogout = () => { logout(); setShowDropdown(false); setShowMobileMenu(false); };

  const handleServicesClick = () => {
    setShowMobileMenu(false);
    navigate(isAuthenticated ? "/booking" : "/auth/login");
  };

  return (
    <nav className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${scrolled ? "border-gray-200 bg-white/98 shadow-lg shadow-black/5 backdrop-blur-md" : "border-gray-100 bg-white/95 backdrop-blur-sm"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6 sm:py-4 lg:px-10">
        {/* Logo */}
        <motion.div className="flex min-w-0 items-center gap-2.5 cursor-pointer" onClick={() => navigate("/")} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-slate-800 text-white shadow-lg shadow-emerald-500/20 sm:h-10 sm:w-10">
            <Hammer size={20} className="sm:w-[23px] sm:h-[23px]" />
          </span>
          <span className="truncate text-xl font-bold uppercase text-emerald-600 sm:text-2xl lg:text-3xl">Herfa</span>
        </motion.div>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-10 text-[13px] font-bold uppercase tracking-tight text-slate-500">
          <motion.button onClick={handleServicesClick} className="text-[15px] hover:text-emerald-500 transition-colors relative group" whileHover={{ y: -1 }}>
            Services
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-emerald-500 transition-all duration-300 group-hover:w-full" />
          </motion.button>
          <Link href="/about" className="transition-colors hover:text-emerald-500 relative group">
            How it Works
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-emerald-500 transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>

        {/* Desktop Right Section */}
        <div className="hidden items-center gap-3 sm:flex">
          {!isAuthenticated ? (
            <>
              <motion.button onClick={() => navigate("/auth/login")} className="text-sm font-bold text-slate-400 transition-colors hover:text-emerald-500 lg:text-base" whileHover={{ y: -1 }}>Login</motion.button>
              <motion.button onClick={() => navigate("/auth/signup")} className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-700 lg:px-8 lg:text-[15px]" whileHover={{ scale: 1.05, y: -1 }} whileTap={{ scale: 0.95 }}>Sign-Up</motion.button>
            </>
          ) : (
            <>
              {user?.role === "artisan" && (
                <div className="relative" ref={notifRef}>
                  <motion.button onClick={() => { setShowNotifications(!showNotifications); setShowDropdown(false); }} className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-emerald-600" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow-sm">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </motion.span>
                    )}
                  </motion.button>
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2 }} className="absolute right-0 mt-3">
                        <NotificationPanel onClose={() => setShowNotifications(false)} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Avatar Dropdown */}
              <div className="relative group/avatar">
                <motion.button onClick={() => { setShowDropdown(!showDropdown); setShowNotifications(false); }} className="h-10 w-10 overflow-hidden rounded-full border-2 border-emerald-500/20 p-0.5 shadow-sm transition-all hover:border-emerald-500" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <img src={user?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2000&auto=format&fit=crop"} alt="Profile" className="h-full w-full rounded-full object-cover" />
                </motion.button>
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2 }} className="absolute right-0 mt-4 flex w-60 translate-y-1 flex-col gap-1 rounded-3xl border border-gray-100 bg-white p-2 shadow-2xl">
                      <button onClick={() => navigate(getDashboardPath())} className="flex w-full items-center gap-4 rounded-2xl p-4 text-sm font-bold text-slate-700 transition-colors hover:bg-emerald-50">
                        <LayoutDashboard size={18} className="text-emerald-500" /><span>Dashboard</span>
                      </button>
                      {user?.role === "customer" && (
                        <button onClick={() => navigate("/customer/settings")} className="flex w-full items-center gap-4 rounded-2xl p-4 text-sm font-bold text-slate-700 transition-colors hover:bg-emerald-50">
                          <Settings size={18} className="text-emerald-500" /><span>Settings</span>
                        </button>
                      )}
                      {user?.role === "artisan" && (
                        <>
                          <button onClick={() => navigate("/artisan/create-profile")} className="flex w-full items-center gap-4 rounded-2xl p-4 text-sm font-bold text-slate-700 transition-colors hover:bg-emerald-50">
                            <User size={18} className="text-emerald-500" /><span>Create Profile</span>
                          </button>
                          <button onClick={() => navigate("/artisan/edit-profile")} className="flex w-full items-center gap-4 rounded-2xl p-4 text-sm font-bold text-slate-700 transition-colors hover:bg-emerald-50">
                            <Settings size={18} className="text-emerald-500" /><span>Edit Profile</span>
                          </button>
                        </>
                      )}
                      <button onClick={handleLogout} className="flex w-full items-center gap-4 rounded-2xl p-4 text-sm font-bold text-red-500 transition-colors hover:bg-red-50">
                        <LogOut size={18} /><span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <motion.button onClick={() => setShowMobileMenu((prev) => !prev)} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 sm:hidden" aria-label="Toggle navigation menu" whileTap={{ scale: 0.9 }}>
          <AnimatePresence mode="wait">
            {showMobileMenu ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><X size={18} /></motion.div>
            ) : (
              <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><Menu size={18} /></motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="border-t border-slate-100 bg-white overflow-hidden sm:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4">
              <motion.button onClick={handleServicesClick} className="rounded-2xl bg-slate-50 px-4 py-3.5 text-left text-sm font-semibold text-slate-700 active:bg-slate-100" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}>Services</motion.button>
              <motion.button onClick={() => navigate("/about")} className="rounded-2xl bg-slate-50 px-4 py-3.5 text-left text-sm font-semibold text-slate-700 active:bg-slate-100" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>How it Works</motion.button>
              {!isAuthenticated ? (
                <>
                  <motion.button onClick={() => navigate("/auth/login")} className="rounded-2xl border border-slate-200 px-4 py-3.5 text-left text-sm font-semibold text-slate-700 active:bg-slate-50" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>Login</motion.button>
                  <motion.button onClick={() => navigate("/auth/signup")} className="rounded-2xl bg-emerald-600 px-4 py-3.5 text-left text-sm font-semibold text-white active:bg-emerald-700" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>Sign-Up</motion.button>
                </>
              ) : (
                <>
                  <motion.button onClick={() => navigate(getDashboardPath())} className="rounded-2xl border border-slate-200 px-4 py-3.5 text-left text-sm font-semibold text-slate-700 active:bg-slate-50" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>Dashboard</motion.button>
                  {user?.role === "customer" && (
                    <motion.button onClick={() => navigate("/customer/settings")} className="rounded-2xl border border-slate-200 px-4 py-3.5 text-left text-sm font-semibold text-slate-700 active:bg-slate-50" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>Settings</motion.button>
                  )}
                  <motion.button onClick={handleLogout} className="rounded-2xl bg-red-50 px-4 py-3.5 text-left text-sm font-semibold text-red-500 active:bg-red-100" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>Logout</motion.button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
