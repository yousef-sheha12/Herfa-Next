"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2, Inbox } from "lucide-react";
import { useGetOffersByRequest, useAcceptOffer, useRejectOffer } from "@/hooks/offers/useOffers";
import { useToast } from "@/hooks/useToast";
import OfferCard from "./OfferCard";

function OffersForRequests({ requests }) {
  const toast = useToast();
  const acceptOffer = useAcceptOffer();
  const rejectOffer = useRejectOffer();
  const [page, setPage] = useState(1);
  const perPage = 5;

  const requestsWithOffers = useMemo(() => {
    return requests.filter((r) => {
      const s = (r.status || "").toLowerCase();
      return s === "pending" || s === "open";
    });
  }, [requests]);

  if (requestsWithOffers.length === 0) {
    return (
      <div className="p-8 sm:p-10 border-2 border-dashed border-slate-100 rounded-[2rem] text-center">
        <Inbox className="w-10 h-10 text-slate-200 mx-auto mb-3" />
        <p className="text-slate-400 text-sm">No pending requests to show offers for.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {requestsWithOffers.map((request) => (
        <OffersForRequest
          key={request.id}
          request={request}
          acceptOffer={acceptOffer}
          rejectOffer={rejectOffer}
          toast={toast}
        />
      ))}
    </div>
  );
}

function OffersForRequest({ request, acceptOffer, rejectOffer, toast }) {
  const { data: offersData, isLoading } = useGetOffersByRequest(request.id);
  const offers = useMemo(() => {
    if (!offersData) return [];
    const list = Array.isArray(offersData) ? offersData : offersData?.data || [];
    return list.filter((o) => {
      const s = (o.status || o.Status || "").toLowerCase();
      return s !== "accepted" && s !== "rejected";
    });
  }, [offersData]);

  const handleAccept = async (offerId) => {
    try {
      await acceptOffer.mutateAsync(offerId);
      toast.success("Offer accepted successfully!");
    } catch (err) {
      const detail = err?.response?.data?.message || err?.response?.data?.title || err?.response?.data?.detail;
      toast.error(detail || "Failed to accept offer.");
    }
  };

  const handleReject = async (offerId) => {
    try {
      await rejectOffer.mutateAsync(offerId);
      toast.info("Offer rejected.");
    } catch (err) {
      const detail = err?.response?.data?.message || err?.response?.data?.title || err?.response?.data?.detail;
      toast.error(detail || "Failed to reject offer.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="w-5 h-5 animate-spin text-teal-500" />
      </div>
    );
  }

  if (offers.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">
        Offers for: {request.title || request.description?.slice(0, 40) || "Request"}
      </p>
      {offers.map((offer, index) => (
        <motion.div
          key={offer.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <OfferCard
            offer={offer}
            requestTitle={request.title}
            onAccept={handleAccept}
            onReject={handleReject}
            isProcessing={acceptOffer.isPending || rejectOffer.isPending}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default function OffersList({ requests, isLoading }) {
  const [page, setPage] = useState(1);
  const perPage = 5;

  const pendingRequests = useMemo(() => {
    if (!Array.isArray(requests)) return [];
    return requests.filter((r) => {
      const s = (r.status || "").toLowerCase();
      return s === "pending" || s === "open";
    });
  }, [requests]);

  const total = Math.ceil(pendingRequests.length / perPage);
  const pageItems = pendingRequests.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-slate-800 sm:text-lg">Incoming Offers</h3>
          <span className="w-5 h-5 bg-teal-100 text-teal-700 flex items-center justify-center rounded-full text-[10px] font-bold">
            {pendingRequests.length}
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-10">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
        </div>
      ) : (
        <OffersForRequests requests={pageItems} />
      )}

      {total > 1 && (
        <div className="flex items-center justify-center gap-4 mt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`p-2 rounded-xl border transition-all ${page === 1 ? "text-slate-200 border-slate-50" : "text-slate-600 border-slate-200 hover:bg-white shadow-sm"}`}
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{page} / {total}</span>
          <button
            onClick={() => setPage((p) => Math.min(total, p + 1))}
            disabled={page === total}
            className={`p-2 rounded-xl border transition-all ${page === total ? "text-slate-200 border-slate-50" : "text-slate-600 border-slate-200 hover:bg-white shadow-sm"}`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
