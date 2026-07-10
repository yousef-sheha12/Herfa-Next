"use client";

import { Loader2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetArtisans, useGetArtisanProfile } from "@/hooks/artisan/useArtisan";
import { useAuth } from "@/hooks/useApi";
import ProfileHeader from "./profile/ProfileHeader";

export default function ProfileView({ id }) {
  const router = useRouter();
  const { user } = useAuth();

  const { data: artisansRaw } = useGetArtisans();
  const artisansList = Array.isArray(artisansRaw) ? artisansRaw : artisansRaw?.data || [];

  const resolvedId = (() => {
    if (!id) return null;

    if (id === "me") {
      if (!user?.id) return null;
      const myProfile = artisansList.find((a) => a.userId === user.id);
      return myProfile?.id || null;
    }

    const numId = Number(id);
    if (!isNaN(numId)) {
      const found = artisansList.find((a) => a.id === numId);
      if (found) return found.id;
      const byUser = artisansList.find((a) => a.userId === numId);
      if (byUser) return byUser.id;
      return numId;
    }
    return null;
  })();

  const { data: artisanRaw, isLoading, isError } = useGetArtisanProfile(resolvedId);

  const artisanData = artisanRaw && (Array.isArray(artisanRaw) ? artisanRaw[0] : artisanRaw.data || artisanRaw);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (isError || !artisanData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <AlertTriangle className="w-12 h-12 text-amber-400" />
        <h2 className="text-xl font-bold text-slate-800">Artisan Not Found</h2>
        <p className="text-slate-500 text-sm">This artisan profile doesn&apos;t exist or has been removed.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const artisan = {
    id: resolvedId,
    name: artisanData.name || artisanData.userName || `Artisan #${artisanData.userId || id}`,
    role: artisanData.role || "PROFESSIONAL",
    rating: artisanData.rating || 0,
    reviews: artisanData.totalReviews ?? 0,
    completedJobs: artisanData.completedJobs?.toString() || "0",
    verifiedStatus: artisanData.isVerified ? "Verified" : "Pending",
    bio: artisanData.bio || "",
    city: artisanData.city || "",
    avatar:
      artisanData.avatar ||
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2000&auto=format&fit=crop",
  };

  return (
    <div className="min-h-screen bg-white">
      <ProfileHeader artisan={artisan} />
    </div>
  );
}
