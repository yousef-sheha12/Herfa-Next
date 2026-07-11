"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useApi";
import {
  useGetArtisans,
  useGetArtisanProfile,
  useUpdateArtisanProfile,
} from "@/hooks/artisan/useArtisan";
import { useGetCategories } from "@/hooks/category/useCategory";
import { useToast } from "@/hooks/useToast";
import { ArrowLeft, Loader2, Save, AlertTriangle } from "lucide-react";

export default function ArtisanEditProfile() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const { data: artisans, isLoading: artisansLoading } = useGetArtisans();
  const artisansList = Array.isArray(artisans)
    ? artisans
    : artisans?.data || [];
  const myArtisan = artisansList.find((a) => a.userId === user?.id) || null;
  const artisanId = myArtisan?.id || null;
  const { data: profileData, isLoading: profileLoading } =
    useGetArtisanProfile(artisanId);
  const updateProfile = useUpdateArtisanProfile();
  const { data: categoriesData, isLoading: catLoading } = useGetCategories();

  const profile =
    profileData &&
    (Array.isArray(profileData)
      ? profileData[0]
      : profileData.data || profileData);

  const [form, setForm] = useState({
    bio: "",
    city: "",
    categoryId: "",
  });

  const categoryList = Array.isArray(categoriesData)
    ? categoriesData
    : categoriesData?.data || [];

  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (profile) {
      setForm({
        bio: profile.bio || "",
        city: profile.city || "",
        categoryId: String(profile.categoryId || ""),
      });
      initialLoadDone.current = true;
    }
  }, [profile]);

  useEffect(() => {
    if (!initialLoadDone.current || !artisanId || !form.categoryId) return;
    updateProfile.mutate(
      { id: artisanId, bio: form.bio, city: form.city, categoryId: Number(form.categoryId) },
      { onSuccess: () => toast.success("Category saved") }
    );
  }, [form.categoryId]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.categoryId) {
      toast.error("Please select a category");
      return;
    }

    try {
      await updateProfile.mutateAsync({
        id: artisanId,
        bio: form.bio,
        city: form.city,
        categoryId: Number(form.categoryId),
      });
      toast.success("Profile updated successfully!");
      router.push("/artisan/me");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.title;
      toast.error(msg || "Failed to update profile");
    }
  };

  if (artisansLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!artisanId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <AlertTriangle className="w-12 h-12 text-amber-400" />
        <h2 className="text-xl font-bold text-slate-800 text-center">
          No Artisan Profile Found
        </h2>
        <p className="text-slate-500 text-sm text-center">
          You need to create an artisan profile first.
        </p>
        <motion.button
          onClick={() => router.push("/artisan/create-profile")}
          className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Create Profile
        </motion.button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 mt-10">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <motion.button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -3 }}
        >
          <ArrowLeft size={18} /> Back
        </motion.button>

        <motion.div
          className="rounded-[2rem] border border-slate-100 bg-white shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative h-32 sm:h-40 bg-gradient-to-br from-emerald-500 via-teal-600 to-slate-800">
            <div className="absolute inset-0 bg-black/10" />
          </div>

          <div className="relative px-5 pb-6 sm:px-8 sm:pb-8">
            <div className="mb-5 sm:mb-6">
              <h1 className="text-xl font-black text-slate-900 sm:text-2xl">
                {myArtisan?.userName || user?.username || "Artisan"}
              </h1>
              <p className="text-sm text-slate-500">
                Update your artisan information
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 sm:gap-8">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell clients about your experience, skills, and what you offer..."
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Category *
                  </label>
                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    required
                    disabled={catLoading}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="">
                      {catLoading ? "Loading..." : "Select category"}
                    </option>
                    {categoryList.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="e.g. Cairo, Alexandria"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={updateProfile.isPending}
                className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-700 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {updateProfile.isPending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {updateProfile.isPending ? "Saving..." : "Save Changes"}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
