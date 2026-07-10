"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

  useEffect(() => {
    if (profile) {
      setForm({
        bio: profile.bio || "",
        city: profile.city || "",
        categoryId: String(profile.categoryId || ""),
      });
    }
  }, [profile]);

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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <AlertTriangle className="w-12 h-12 text-amber-400" />
        <h2 className="text-xl font-bold text-slate-800">
          No Artisan Profile Found
        </h2>
        <p className="text-slate-500 text-sm">
          You need to create an artisan profile first.
        </p>
        <button
          onClick={() => router.push("/artisan/create-profile")}
          className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors"
        >
          Create Profile
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 mt-10">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <div className="rounded-[2rem] border border-slate-100 bg-white shadow-sm overflow-hidden">
          {/* Header Banner */}
          <div className="relative h-40 bg-gradient-to-br from-emerald-500 via-teal-600 to-slate-800">
            <div className="absolute inset-0 bg-black/10" />
          </div>

          {/* Avatar Section */}
          <div className="relative px-8 pb-8">
            <div className="-mt-20 mb-6 flex items-end gap-6">
              <div className="relative shrink-0">
                <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-100">
                  <img
                    src={
                      profile?.imageUrl ||
                      profile?.avatar ||
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2000&auto=format&fit=crop"
                    }
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="pb-2">
                <h1 className="text-2xl font-black text-slate-900">
                  Edit Profile
                </h1>
                <p className="text-sm text-slate-500">
                  Update your artisan information
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              {/* Bio */}
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

              {/* Category & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

              <button
                type="submit"
                disabled={updateProfile.isPending}
                className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-700 disabled:opacity-50"
              >
                {updateProfile.isPending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {updateProfile.isPending ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
