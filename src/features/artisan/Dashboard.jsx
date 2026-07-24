"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateOffer } from "@/hooks/offers/useOffers";
import { useToast } from "@/hooks/useToast";
import { useDashboardData } from "@/hooks/artisan/useDashboardData";
import api from "@/services/api";
import StatCards from "./dashboard/StatCards";
import EarningsChart from "./dashboard/EarningsChart";
import RequestList from "./dashboard/RequestList";

export default function Dashboard() {
  const toast = useToast();
  const router = useRouter();
  const createOffer = useCreateOffer();
  const { user, authLoading, isAuthenticated, profile, profileLoading, requestsLoading, pendingRequests, allEarnedJobs, stats, earnings, removedIds, setRemovedIds } = useDashboardData();

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "artisan")) router.push("/auth/login");
  }, [authLoading, isAuthenticated, user, router]);

  const handleAccept = async (requestId) => {
    if (!profile) { toast.error("Please complete your artisan profile before sending offers."); return; }

    let existingOfferId = null;
    try {
      const { data: existingOffers } = await api.get(`/Offers/request/${Number(requestId)}`);
      const list = Array.isArray(existingOffers) ? existingOffers : existingOffers?.data || [];
      const myOffer = list.find((o) => {
        const aid = o.artisanId ?? o.ArtisanId ?? o.artisan?.id ?? o.Artisan?.Id;
        return Number(aid) === Number(profile.id || profile.Id);
      }) || list[0];
      existingOfferId = myOffer?.id ?? myOffer?.Id ?? myOffer?.offerId;
    } catch {}

    if (existingOfferId) { setRemovedIds((prev) => [...prev, requestId]); toast.info("You already have an offer on this request."); return; }

    const price = window.prompt("Enter your offer price:");
    if (price === null) return;
    const amount = parseFloat(price);
    if (isNaN(amount) || amount <= 0) { toast.error("Please enter a valid price"); return; }

    try {
      await createOffer.mutateAsync({ requestId: Number(requestId), price: amount, message: "I can help with this request" });
      setRemovedIds((prev) => [...prev, requestId]);
      toast.success("Offer sent! Waiting for customer to accept.");
    } catch (err) {
      const errData = err?.response?.data;
      const detail = typeof errData === "string" ? errData : (errData?.detail || errData?.title || errData?.message || "");
      toast.error(err?.response?.status ? `Error ${err.response.status}: ${detail || "Server error"}` : (detail || "Failed to send offer."));
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <div className="px-4 pb-12 pt-24 sm:px-6 lg:px-8 lg:pt-28 relative mt-8">
        <div className="mx-auto max-w-[1360px]">
          <motion.button onClick={() => router.push("/")} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-teal-600 transition-colors text-sm font-bold" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} whileHover={{ x: -3 }}>
            <ArrowLeft size={18} /> Back to Home
          </motion.button>
          <motion.section className="flex flex-col rounded-[2rem] border border-slate-200 bg-white shadow-sm overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="grid gap-8 p-4 sm:p-6 lg:p-8 grid-cols-1 lg:grid-cols-12">
              <div className="flex flex-col gap-6 lg:col-span-8">
                <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
                      Marhaba, {user?.username?.split(" ")[0] || user?.email?.split("@")[0] || "Artisan"}
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">Your artisan dashboard is ready.{profile?.categoryName ? ` | ${profile.categoryName}` : ""}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Current Status</p>
                    <p className="mt-1 text-lg font-bold text-emerald-600">Available for booking</p>
                  </div>
                </header>
                <StatCards earnings={earnings} stats={stats} isLoading={profileLoading} />
                <EarningsChart earningsData={earnings} completedJobs={allEarnedJobs} />
              </div>
              <RequestList requests={pendingRequests} isLoading={requestsLoading} onSendOffer={handleAccept} isSending={createOffer.isPending} />
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
