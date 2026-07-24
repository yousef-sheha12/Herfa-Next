"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useApi";
import { useGetCategories } from "@/hooks/category/useCategory";
import { useGetArtisans } from "@/hooks/artisan/useArtisan";
import Hero from "@/features/home/Hero";
import MeetTheMasters from "@/features/home/MeetTheMasters";
import Features from "@/features/home/Features";
import PremiumSection from "@/features/home/PremiumSection";
import { features } from "@/constants/mockData/HomeMockData";
import Footer from "@/components/layout/Footer";
import { Wrench, Hammer, Droplet, Zap, PaintBucket } from "lucide-react";

const iconMap = { carpentry: Hammer, plumbing: Droplet, electrical: Zap, painting: PaintBucket, maintenance: Wrench, general: Wrench, cleaning: Wrench, moving: Wrench };

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data: categoriesData } = useGetCategories();
  const { data: artisansData } = useGetArtisans();

  const categories = Array.isArray(categoriesData)
    ? categoriesData.map((cat) => ({ id: cat.id, name: cat.name, icon: iconMap[cat.name?.toLowerCase()] || Wrench, service: cat.name?.toLowerCase() || "" }))
    : [];

  const rawMasters = Array.isArray(artisansData) ? artisansData : artisansData?.data || [];
  const masters = rawMasters.slice(0, 3).map((a) => ({
    id: a.id,
    name: a.name || a.userName || `Artisan #${a.id}`,
    role: a.role || a.categoryName || "PROFESSIONAL",
    rating: a.rating ? parseFloat(a.rating).toFixed(1) : "4.5",
    jobs: a.completedJobs ? `${a.completedJobs} jobs` : "0 jobs",
    image: a.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    skills: a.skills || [a.categoryName?.toLowerCase()].filter(Boolean),
  }));

  const goAuth = (path = "/") => { if (!isAuthenticated) { router.push("/auth/login"); return; } router.push(path); };
  const goService = (term) => { if (!isAuthenticated) { router.push("/auth/login"); return; } router.push(`/booking?service=${encodeURIComponent(term || "all")}`); };

  return (
    <div className="bg-[#f7f4ef] pt-20 text-slate-800">
      <Hero categories={categories} onCategoryClick={(c) => goService(c.service)} onSearchClick={goService} />
      <MeetTheMasters masters={masters} onBookNow={() => goAuth("/booking")} onViewProfile={(e, a) => { e.preventDefault(); router.push(`/artisan/${a.id}`); }} />
      <PremiumSection onLogin={() => router.push("/auth/login")} />
      <Features features={features} />
      <Footer />
    </div>
  );
}
