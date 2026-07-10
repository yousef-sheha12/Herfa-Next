"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useApi";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const redirected = useRef(false);

  useEffect(() => {
    if (isLoading) return;
    if (redirected.current) return;

    if (!isAuthenticated) {
      redirected.current = true;
      router.push("/auth/login");
      return;
    }

    if (allowedRoles?.length && !allowedRoles.includes(user?.role)) {
      const dashboard =
        user?.role === "artisan" ? "/artisan/dashboard" : "/customer/dashboard";
      if (pathname !== dashboard) {
        redirected.current = true;
        router.push(dashboard);
      }
    }
  }, [isAuthenticated, user, isLoading, allowedRoles, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <span className="loading loading-spinner loading-lg text-emerald-500" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (allowedRoles?.length && !allowedRoles.includes(user?.role)) {
    const dashboard = user?.role === "artisan" ? "/artisan/dashboard" : "/customer/dashboard";
    if (pathname !== dashboard) return null;
  }

  return children;
}
