"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthLayout({ children, showBackButton = true }) {
  const router = useRouter();

  return (
    <div className="relative flex min-h-[100dvh] items-start justify-center overflow-y-auto overflow-x-hidden bg-workshop px-3 py-16 sm:px-4 sm:py-20 md:items-center md:px-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[4px] z-0 pointer-events-none" />

      {showBackButton && (
        <button
          onClick={() => router.push("/")}
          className="absolute left-3 top-3 mt-14 z-10 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-medium text-white backdrop-blur-md transition-all hover:bg-white/20 sm:left-4 sm:top-4 sm:px-4 sm:py-2.5 sm:text-sm md:left-6 md:top-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return Home</span>
        </button>
      )}

      <div className="relative z-10 flex w-full max-w-md flex-col gap-4 rounded-[1.75rem] border border-white/20 bg-white p-4 shadow-2xl transition-all sm:rounded-[2rem] sm:p-5 md:max-w-lg md:gap-5 md:p-6">
        {children}
      </div>
    </div>
  );
}
