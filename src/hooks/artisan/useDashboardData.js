"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useApi";
import { useGetRequests } from "@/hooks/requests/useRequests";
import {
  useGetArtisans,
  useGetArtisanProfile,
} from "@/hooks/artisan/useArtisan";
import { useGetJobs } from "@/hooks/jobs/useJobs";
import api from "@/services/api";

export function useDashboardData() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { data: requestsData, isLoading: requestsLoading } = useGetRequests(
    !authLoading && isAuthenticated,
  );
  const { data: artisans } = useGetArtisans();
  const artisansList = Array.isArray(artisans)
    ? artisans
    : artisans?.data || [];
  const myArtisan = artisansList.find((a) => a.userId === user?.id) || null;
  const artisanId = user?.artisanId || myArtisan?.id;
  const { data: artisanProfile, isLoading: profileLoading } =
    useGetArtisanProfile(artisanId);
  const { data: jobsData, refetch: refetchJobs } = useGetJobs();

  const [removedIds, setRemovedIds] = useState([]);
  const [acceptedOffers, setAcceptedOffers] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => refetchJobs(), 10000);
    return () => clearInterval(interval);
  }, [refetchJobs]);

  const profile = (() => {
    if (!artisanProfile) return null;
    if (Array.isArray(artisanProfile)) return artisanProfile[0] || null;
    return artisanProfile.data || artisanProfile;
  })();

  const raw = Array.isArray(requestsData)
    ? requestsData
    : requestsData?.data || [];
  const pendingRequests = useMemo(() => {
    const artisanCategoryId =
      profile?.categoryId || profile?.CategoryId || null;
    const artisanCategoryName = (
      profile?.categoryName ||
      profile?.Category?.name ||
      ""
    ).toLowerCase();
    return raw.filter((r) => {
      if (removedIds.includes(r.id)) return false;
      const status = (r.status || "").toLowerCase();
      if (status !== "pending" && status !== "open") return false;
      if (!artisanCategoryId && !artisanCategoryName) return true;
      const reqCategoryId =
        r.categoryId || r.CategoryId || r.category?.id || null;
      if (
        reqCategoryId &&
        artisanCategoryId &&
        Number(reqCategoryId) === Number(artisanCategoryId)
      )
        return true;
      const reqCategoryName = (
        r.category ||
        r.Category ||
        r.categoryName ||
        r.title ||
        ""
      ).toLowerCase();
      if (artisanCategoryName && reqCategoryName === artisanCategoryName)
        return true;
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
            const aid =
              o.artisanId ?? o.ArtisanId ?? o.artisan?.id ?? o.Artisan?.Id;
            const s = (o.status || o.Status || "").toLowerCase();
            return (
              Number(aid) === Number(profile.id || profile.Id) &&
              s === "accepted"
            );
          });
          if (myAccepted)
            results.push({ ...myAccepted, requestId: req.id, request: req });
        } catch {}
      }
      if (!cancelled) setAcceptedOffers(results);
    };
    fetchAllOffers();
    const interval = setInterval(fetchAllOffers, 10000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
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
    .filter((j) => (j.date || "").split("T")[0] === todayStr)
    .reduce((sum, j) => sum + j.price, 0);
  const weeklyEarnings = allEarnedJobs
    .filter((j) => new Date(j.date || "") >= startOfWeek)
    .reduce((sum, j) => sum + j.price, 0);

  return {
    user,
    authLoading,
    isAuthenticated,
    profile,
    profileLoading,
    requestsLoading,
    pendingRequests,
    allEarnedJobs,
    stats: {
      completedJobs:
        allEarnedJobs.length ||
        profile?.completedJobs ||
        profile?.totalJobs ||
        0,
      averageRating: profile?.rating || 0,
    },
    earnings: {
      today: todayEarnings || profile?.earnings?.today || 0,
      week: weeklyEarnings,
    },
    removedIds,
    setRemovedIds,
  };
}
