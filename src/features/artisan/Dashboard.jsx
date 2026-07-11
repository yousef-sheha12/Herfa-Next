"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useApi";
import { useGetRequests } from "@/hooks/requests/useRequests";
import { useCreateOffer } from "@/hooks/offers/useOffers";
import api from "@/services/api";
import { useGetArtisans, useGetArtisanProfile } from "@/hooks/artisan/useArtisan";
import { useGetJobs } from "@/hooks/jobs/useJobs";
import { useToast } from "@/hooks/useToast";
import StatCards from "./dashboard/StatCards";
import EarningsChart from "./dashboard/EarningsChart";
import RequestList from "./dashboard/RequestList";

export default function Dashboard() {
  const toast = useToast();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const { data: requestsData, isLoading: requestsLoading } = useGetRequests(!authLoading && isAuthenticated);
  const createOffer = useCreateOffer();
  const { data: artisans } = useGetArtisans();
  const artisansList = Array.isArray(artisans) ? artisans : artisans?.data || [];
  const myArtisan = artisansList.find((a) => a.userId === user?.id) || null;
  const artisanId = user?.artisanId || myArtisan?.id;
  const { data: artisanProfile, isLoading: profileLoading } = useGetArtisanProfile(artisanId);
  const { data: jobsData, refetch: refetchJobs } = useGetJobs();

  const [removedIds, setRemovedIds] = useState([]);
  const [acceptedOffers, setAcceptedOffers] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      refetchJobs();
    }, 10000);
    return () => clearInterval(interval);
  }, [refetchJobs]);

  const profile = (() => {
    if (!artisanProfile) return null;
    if (Array.isArray(artisanProfile)) return artisanProfile[0] || null;
    return artisanProfile.data || artisanProfile;
  })();

  const raw = Array.isArray(requestsData) ? requestsData : requestsData?.data || [];
  const pendingRequests = useMemo(() => {
    const artisanCategoryId = profile?.categoryId || profile?.CategoryId || null;
    const artisanCategoryName = (profile?.categoryName || profile?.Category?.name || "").toLowerCase();

    return raw.filter((r) => {
      if (removedIds.includes(r.id)) return false;
      const status = (r.status || "").toLowerCase();
      if (status !== "pending" && status !== "open") return false;
      if (!artisanCategoryId && !artisanCategoryName) return true;

      const reqCategoryId = r.categoryId || r.CategoryId || r.category?.id || null;
      if (reqCategoryId && artisanCategoryId && Number(reqCategoryId) === Number(artisanCategoryId)) return true;

      const reqCategoryName = (r.category || r.Category || r.categoryName || r.title || "").toLowerCase();
      if (artisanCategoryName && reqCategoryName === artisanCategoryName) return true;

      return false;
    });
  }, [raw, removedIds, profile]);

  useEffect(() => {
    if (!raw.length || !profile) return;
    let cancelled = false;

    const fetchAllOffers = async () => {
      const results = [];
      for (const req of raw) {
        try {
          const { data } = await api.get(`/Offers/request/${req.id}`);
          const list = Array.isArray(data) ? data : data?.data || [];
          const myAccepted = list.find((o) => {
            const aid = o.artisanId ?? o.ArtisanId ?? o.artisan?.id ?? o.Artisan?.Id;
            const s = (o.status || o.Status || "").toLowerCase();
            return Number(aid) === Number(profile.id || profile.Id) && s === "accepted";
          });
          if (myAccepted) {
            results.push({ ...myAccepted, requestId: req.id, request: req });
          }
        } catch {}
      }
      if (!cancelled) setAcceptedOffers(results);
    };

    fetchAllOffers();
    const interval = setInterval(fetchAllOffers, 10000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [raw, profile]);

  const rawJobs = Array.isArray(jobsData) ? jobsData : jobsData?.data || [];

  const completedJobs = rawJobs.filter((j) => {
    const s = (j.status || "").toLowerCase();
    return s === "completed" || s === "accepted";
  });

  const allEarnedJobs = [
    ...acceptedOffers.map((o) => ({
      price: o.price || o.Price || 0,
      date: o.request?.createdAt || o.createdAt || "",
      source: "offer",
    })),
    ...completedJobs.map((j) => ({
      price: j.price || j.Price || 0,
      date: j.completedAt || j.updatedAt || j.createdAt || "",
      source: "job",
    })),
  ];

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const todayStr = now.toISOString().split("T")[0];

  const todayEarnings = allEarnedJobs
    .filter((j) => {
      const d = (j.date || "").split("T")[0];
      return d === todayStr;
    })
    .reduce((sum, j) => sum + j.price, 0);

  const weeklyEarnings = allEarnedJobs
    .filter((j) => {
      const d = new Date(j.date || "");
      return d >= startOfWeek;
    })
    .reduce((sum, j) => sum + j.price, 0);

  const totalCompleted = allEarnedJobs.length;

  const stats = {
    completedJobs: totalCompleted || profile?.completedJobs || profile?.totalJobs || 0,
    averageRating: profile?.rating || 0,
  };
  const earnings = {
    today: todayEarnings || profile?.earnings?.today || 0,
    week: weeklyEarnings,
  };

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "artisan")) router.push("/auth/login");
  }, [authLoading, isAuthenticated, user, router]);

  const handleAccept = async (requestId) => {
    if (!profile) {
      toast.error("Please complete your artisan profile before sending offers.");
      return;
    }

    const numericRequestId = Number(requestId);

    let existingOfferId = null;
    try {
      const { data: existingOffers } = await api.get(`/Offers/request/${numericRequestId}`);
      const list = Array.isArray(existingOffers) ? existingOffers : existingOffers?.data || [];
      const myOffer = list.find((o) => {
        const aid = o.artisanId ?? o.ArtisanId ?? o.artisan?.id ?? o.Artisan?.Id;
        return Number(aid) === Number(profile.id || profile.Id);
      }) || list[0];
      existingOfferId = myOffer?.id ?? myOffer?.Id ?? myOffer?.offerId;
    } catch {}

    if (existingOfferId) {
      setRemovedIds((prev) => [...prev, requestId]);
      toast.info("You already have an offer on this request. Wait for the customer to respond.");
      return;
    }

    const price = window.prompt("Enter your offer price:");
    if (price === null) return;
    const amount = parseFloat(price);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    try {
      await createOffer.mutateAsync({ requestId: numericRequestId, price: amount, message: "I can help with this request" });
      setRemovedIds((prev) => [...prev, requestId]);
      toast.success("Offer sent! Waiting for customer to accept.");
    } catch (err) {
      const errData = err?.response?.data;
      const detail = typeof errData === "string" ? errData : (errData?.detail || errData?.title || errData?.message || "");
      const status = err?.response?.status;
      toast.error(status ? `Error ${status}: ${detail || "Server error"}` : (detail || "Failed to send offer."));
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <div className="px-4 pb-12 pt-24 sm:px-6 lg:px-8 lg:pt-28 relative mt-8">
        <div className="mx-auto max-w-[1360px]">
          <motion.button
            onClick={() => router.push("/")}
            className="mb-6 flex items-center gap-2 text-slate-500 hover:text-teal-600 transition-colors text-sm font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -3 }}
          >
            <ArrowLeft size={18} /> Back to Home
          </motion.button>

          <motion.section
            className="flex flex-col rounded-[2rem] border border-slate-200 bg-white shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="grid gap-8 p-4 sm:p-6 lg:p-8 grid-cols-1 lg:grid-cols-12">
              <div className="flex flex-col gap-6 lg:col-span-8">
                <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
                      Marhaba, {user?.username?.split(" ")[0] || user?.email?.split("@")[0] || "Artisan"}
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                      Your artisan dashboard is ready.{profile?.categoryName ? ` | ${profile.categoryName}` : ""}
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Current Status</p>
                    <p className="mt-1 text-lg font-bold text-emerald-600">Available for booking</p>
                  </div>
                </header>

                <StatCards earnings={earnings} stats={stats} isLoading={profileLoading} />
                <EarningsChart earningsData={earnings} completedJobs={allEarnedJobs} />
              </div>

              <RequestList
                requests={pendingRequests}
                isLoading={requestsLoading}
                onSendOffer={handleAccept}
                isSending={createOffer.isPending}
              />
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
