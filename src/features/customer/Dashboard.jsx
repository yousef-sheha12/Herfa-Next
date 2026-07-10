"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useApi";
import { useGetRequests } from "@/hooks/requests/useRequests";
import dynamic from "next/dynamic";
import HeroBanner from "./dashboard/HeroBanner";
import RequestForm from "./dashboard/RequestForm";
import RequestList from "./dashboard/RequestList";

const ArtisansMap = dynamic(() => import("@/components/maps/ArtisansMap"), { ssr: false });

export default function Dashboard() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const { data: requestsRaw, isLoading } = useGetRequests();
  const requestsData = Array.isArray(requestsRaw) ? requestsRaw : requestsRaw?.data || [];

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/auth/login");
  }, [authLoading, isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="pt-24 lg:pt-28 max-w-[1200px] mx-auto px-4 sm:px-6">
        <HeroBanner userName={user?.username?.split(" ")[0] || user?.email?.split("@")[0] || "Friend"} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-24">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <RequestForm />
          </div>

          <div className="flex flex-col gap-8">
            <RequestList requests={requestsData} isLoading={isLoading} />
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-20">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Artisans Near You</h2>
              <p className="text-xs text-slate-400 font-medium">48 verified professionals available in your area</p>
            </div>
            <button onClick={() => router.push("/artisan/dashboard")} className="text-[#2D6A6A] font-bold text-xs hover:underline">View All</button>
          </div>
          <div className="relative h-[450px] rounded-[2.5rem] border border-slate-200 shadow-lg overflow-hidden">
            <ArtisansMap />
          </div>
        </div>
      </div>
    </div>
  );
}
