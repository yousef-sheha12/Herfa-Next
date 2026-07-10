"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  LayoutDashboard,
  Hammer,
  Menu,
  X,
  User,
  Settings,
  Bell,
} from "lucide-react";
import { useAuth } from "@/hooks/useApi";
import { useGetUnreadNotifications } from "@/hooks/notifications/useNotifications";
import NotificationPanel from "./NotificationPanel";

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);
  const { data: unreadData } = useGetUnreadNotifications(isAuthenticated && user?.role === "artisan");
  const unreadCount = Array.isArray(unreadData)
    ? unreadData.length
    : (unreadData?.length ?? 0);

  const handleServicesClick = () => {
    setShowMobileMenu(false);
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    router.push("/booking");
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    setShowMobileMenu(false);
  };

  const getDashboardPath = () => {
    if (user?.role === "artisan") return "/artisan/dashboard";
    return "/customer/dashboard";
  };

  const handleNavigate = (path) => {
    router.push(path);
    setShowMobileMenu(false);
    setShowDropdown(false);
    setShowNotifications(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-10">
        {/* Logo */}
        <div
          className="flex min-w-0 items-center gap-2.5 cursor-pointer"
          onClick={() => handleNavigate("/")}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-slate-800 text-white shadow-lg shadow-emerald-500/20">
            <Hammer size={23} />
          </span>
          <span className="truncate text-2xl font-bold uppercase text-emerald-600 sm:text-3xl">
            Herfa
          </span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-10 text-[13px] font-bold uppercase tracking-tight text-slate-500">
          <button
            onClick={handleServicesClick}
            className="text-[15px] hover:text-emerald-500"
          >
            Services
          </button>
          <Link
            href="/about"
            className="transition-colors hover:text-emerald-500"
          >
            How it Works
          </Link>
        </div>

        {/* Desktop Right Section */}
        <div className="hidden items-center gap-3 sm:flex">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => handleNavigate("/auth/login")}
                className="text-sm font-bold text-slate-400 transition-colors hover:text-emerald-500 lg:text-base"
              >
                Login
              </button>
              <button
                onClick={() => handleNavigate("/auth/signup")}
                className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 hover:bg-emerald-700 active:scale-95 lg:px-8 lg:text-[15px]"
              >
                Sign-Up
              </button>
            </>
          ) : (
            <>
              {/* Notification Bell - Artisan Only */}
              {user?.role === "artisan" && (
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowDropdown(false);
                    }}
                    className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-emerald-600"
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow-sm">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-3">
                      <NotificationPanel
                        onClose={() => setShowNotifications(false)}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Avatar Dropdown */}
              <div className="relative group/avatar">
                <button
                  onClick={() => {
                    setShowDropdown(!showDropdown);
                    setShowNotifications(false);
                  }}
                  className="h-10 w-10 overflow-hidden rounded-full border-2 border-emerald-500/20 p-0.5 shadow-sm transition-all hover:border-emerald-500"
                >
                  <img
                    src={
                      user?.avatar ||
                      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2000&auto=format&fit=crop"
                    }
                    alt="Profile"
                    className="h-full w-full rounded-full object-cover"
                  />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-4 flex w-60 translate-y-1 flex-col gap-1 rounded-3xl border border-gray-100 bg-white p-2 shadow-2xl">
                    <button
                      onClick={() => handleNavigate(getDashboardPath())}
                      className="flex w-full items-center gap-4 rounded-2xl p-4 text-sm font-bold text-slate-700 transition-colors hover:bg-emerald-50"
                    >
                      <LayoutDashboard size={18} className="text-emerald-500" />
                      <span>Dashboard</span>
                    </button>
                    {user?.role === "customer" && (
                      <button
                        onClick={() => handleNavigate("/customer/settings")}
                        className="flex w-full items-center gap-4 rounded-2xl p-4 text-sm font-bold text-slate-700 transition-colors hover:bg-emerald-50"
                      >
                        <Settings size={18} className="text-emerald-500" />
                        <span>Settings</span>
                      </button>
                    )}
                    {user?.role === "artisan" && (
                      <>
                        <button
                          onClick={() =>
                            handleNavigate("/artisan/create-profile")
                          }
                          className="flex w-full items-center gap-4 rounded-2xl p-4 text-sm font-bold text-slate-700 transition-colors hover:bg-emerald-50"
                        >
                          <User size={18} className="text-emerald-500" />
                          <span>Create Profile</span>
                        </button>
                        <button
                          onClick={() =>
                            handleNavigate("/artisan/edit-profile")
                          }
                          className="flex w-full items-center gap-4 rounded-2xl p-4 text-sm font-bold text-slate-700 transition-colors hover:bg-emerald-50"
                        >
                          <Settings size={18} className="text-emerald-500" />
                          <span>Edit Profile</span>
                        </button>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-4 rounded-2xl p-4 text-sm font-bold text-red-500 transition-colors hover:bg-red-50"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowMobileMenu((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 sm:hidden"
          aria-label="Toggle navigation menu"
        >
          {showMobileMenu ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-lg sm:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            <button
              onClick={handleServicesClick}
              className="rounded-2xl bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-700"
            >
              Services
            </button>
            <button
              onClick={() => handleNavigate("/about")}
              className="rounded-2xl bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-700"
            >
              How it Works
            </button>
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNavigate("/auth/login")}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigate("/auth/signup")}
                  className="rounded-2xl bg-emerald-600 px-4 py-3 text-left text-sm font-semibold text-white"
                >
                  Sign-Up
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavigate(getDashboardPath())}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700"
                >
                  Dashboard
                </button>
                {user?.role === "customer" && (
                  <button
                    onClick={() => handleNavigate("/customer/settings")}
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700"
                  >
                    Settings
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="rounded-2xl bg-red-50 px-4 py-3 text-left text-sm font-semibold text-red-500"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
