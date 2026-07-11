"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useApi";
import { useGetRequests } from "@/hooks/requests/useRequests";
import dynamic from "next/dynamic";
import HeroBanner from "./dashboard/HeroBanner";
import RequestForm from "./dashboard/RequestForm";
import RequestList from "./dashboard/RequestList";
import OffersList from "./dashboard/OffersList";

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
      <div className="pt-24 max-w-[1200px] mx-auto px-4 pb-12 sm:px-6 lg:pt-28">
        <HeroBanner userName={user?.username?.split(" ")[0] || user?.email?.split("@")[0] || "Friend"} />

        <div className="grid grid-cols-1 gap-8 pb-12 lg:grid-cols-3 lg:pb-24">
          <div className="flex flex-col gap-8 lg:col-span-2">
            <RequestForm />
            <OffersList requests={requestsData} isLoading={isLoading} />
          </div>

          <div className="flex flex-col gap-8">
            <RequestList requests={requestsData} isLoading={isLoading} />
          </div>
        </div>

        <motion.div
          className="flex flex-col gap-4 mb-12 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-lg font-bold text-slate-800 sm:text-xl">Artisans Near You</h2>
              <p className="text-xs text-slate-400 font-medium">48 verified professionals available in your area</p>
            </div>
            <button onClick={() => router.push("/artisan/dashboard")} className="text-[#2D6A6A] font-bold text-xs hover:underline">View All</button>
          </div>
          <div className="relative h-[300px] rounded-[2rem] border border-slate-200 shadow-lg overflow-hidden sm:h-[400px] lg:h-[450px] lg:rounded-[2.5rem]">
            <ArtisansMap />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
