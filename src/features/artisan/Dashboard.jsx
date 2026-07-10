"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useApi";
import { useGetRequests } from "@/hooks/requests/useRequests";
import { useCancelRequest } from "@/hooks/requests/useRequests";
import { useCreateOffer, useAcceptOffer } from "@/hooks/offers/useOffers";
import api from "@/services/api";
import { useGetArtisans, useGetArtisanProfile } from "@/hooks/artisan/useArtisan";
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
  const acceptOffer = useAcceptOffer();
  const cancelRequest = useCancelRequest();
  const { data: artisans } = useGetArtisans();
  const artisansList = Array.isArray(artisans) ? artisans : artisans?.data || [];
  const myArtisan = artisansList.find((a) => a.userId === user?.id) || null;
  const artisanId = user?.artisanId || myArtisan?.id;
  const { data: artisanProfile, isLoading: profileLoading } = useGetArtisanProfile(artisanId);

  const [removedIds, setRemovedIds] = useState([]);

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

  const stats = { completedJobs: profile?.completedJobs || profile?.totalJobs || 0, averageRating: profile?.rating || 0 };
  const earnings = { today: profile?.earnings?.today || 0 };

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "artisan")) router.push("/auth/login");
  }, [authLoading, isAuthenticated, user, router]);

  const handleAccept = async (requestId) => {
    if (!profile) {
      toast.error("Please complete your artisan profile before accepting requests.");
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
      try {
        await acceptOffer.mutateAsync(Number(existingOfferId));
        setRemovedIds((prev) => [...prev, requestId]);
        toast.success("Request accepted using your existing offer!");
      } catch (acceptErr) {
        const errData = acceptErr?.response?.data;
        const detail = typeof errData === "string" ? errData : (errData?.detail || errData?.title || errData?.message || "");
        if (/already|accepted|in.?progress/i.test(detail)) {
          setRemovedIds((prev) => [...prev, requestId]);
          toast.info("Request is already accepted.");
        } else {
          toast.error(detail || "Failed to accept request.");
        }
      }
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
      const offerRes = await createOffer.mutateAsync({ requestId: numericRequestId, price: amount, message: "I can help with this request" });
      const offerData = offerRes?.data;
      const offerId = typeof offerData === "object" && offerData !== null
        ? (offerData.id ?? offerData.Id ?? offerData.offerId ?? offerData.OfferId)
        : offerData;

      if (!offerId) {
        toast.error("Offer created but response missing ID.");
        return;
      }

      await acceptOffer.mutateAsync(Number(offerId));
      setRemovedIds((prev) => [...prev, requestId]);
      toast.success("Request accepted! Status updated to in-progress.");
    } catch (err) {
      const errData = err?.response?.data;
      const detail = typeof errData === "string" ? errData : (errData?.detail || errData?.title || errData?.message || "");
      const status = err?.response?.status;
      toast.error(status ? `Error ${status}: ${detail || "Server error"}` : (detail || "Failed to create offer."));
    }
  };

  const handleReject = async (requestId) => {
    try {
      await cancelRequest.mutateAsync(Number(requestId));
      setRemovedIds((prev) => [...prev, requestId]);
      toast.info("Request rejected and closed.");
    } catch (err) {
      const detail = err?.response?.data?.detail || err?.response?.data?.title || err?.response?.data?.message;
      toast.error(detail || "Failed to reject request.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <div className="px-4 pb-12 pt-24 sm:px-6 lg:px-8 lg:pt-28 relative mt-8">
        <div className="mx-auto max-w-[1360px]">
          <button onClick={() => router.push("/")} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-teal-600 transition-colors text-sm font-bold">
            <ArrowLeft size={18} /> Back to Home
          </button>

          <section className="flex flex-col rounded-[2rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="grid gap-8 p-4 sm:p-6 lg:p-8 grid-cols-1 lg:grid-cols-12">
              <div className="flex flex-col gap-6 lg:col-span-8">
                <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
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
                <EarningsChart earningsData={earnings} />
              </div>

              <RequestList
                requests={pendingRequests}
                isLoading={requestsLoading}
                onAccept={handleAccept}
                onReject={handleReject}
                isAccepting={createOffer.isPending || acceptOffer.isPending}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
