"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useApi";
import {
  useCreateArtisanProfile,
  useGetArtisans,
} from "@/hooks/artisan/useArtisan";
import { useGetCategories } from "@/hooks/category/useCategory";
import { useToast } from "@/hooks/useToast";
import { setAuth } from "@/lib/authStorage";
import { Hammer, Loader2, ArrowLeft, Camera } from "lucide-react";

export default function ArtisanProfileForm() {
  const router = useRouter();
  const { user, token } = useAuth();
  const toast = useToast();
  const createProfile = useCreateArtisanProfile();
  const { data: categoriesData, isLoading: catLoading } = useGetCategories();
  const { data: artisans, isLoading: artisansLoading } = useGetArtisans();

  const artisansList = Array.isArray(artisans)
    ? artisans
    : artisans?.data || [];
  const existingProfile = artisansList.find((a) => a.userId === user?.id);

  useEffect(() => {
    if (!artisansLoading && existingProfile) {
      router.replace("/artisan/edit-profile");
    }
  }, [artisansLoading, existingProfile, router]);

  const [form, setForm] = useState({
    categoryId: "",
    nationalId: "",
    bio: "",
    city: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

  const categoryList = Array.isArray(categoriesData)
    ? categoriesData
    : categoriesData?.data || [];

  if (artisansLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (existingProfile) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.categoryId) {
      toast.error("Please select a category");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("UserId", String(user?.id || ""));
      fd.append("CategoryId", Number(form.categoryId));
      if (form.nationalId) fd.append("NationalId", form.nationalId);
      if (form.bio) fd.append("Bio", form.bio);
      if (form.city) fd.append("City", form.city);
      if (imageFile) fd.append("ImageFile", imageFile);

      const res = await createProfile.mutateAsync(fd);
      const created = res?.data || res;
      const newArtisanId = created?.id || created?.data?.id;

      if (newArtisanId) {
        const updatedUser = { ...user, artisanId: newArtisanId };
        setAuth(updatedUser, token);
      }
      toast.success("Profile created successfully!");
      router.push("/artisan/dashboard");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        err?.response?.data?.detail;
      const status = err?.response?.status;
      if (
        status === 400 ||
        status === 409 ||
        /exist|already|duplicate/i.test(msg)
      ) {
        toast.info("Profile already exists. Redirecting to edit...");
        router.replace("/artisan/edit-profile");
        return;
      }
      toast.error(msg || "Failed to create profile");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
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
          className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm sm:p-8 sm:rounded-[2rem]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-slate-800 text-white shadow-lg shadow-emerald-500/20 sm:h-12 sm:w-12">
              <Hammer size={20} />
            </span>
            <div>
              <h1 className="text-xl font-black text-slate-900 sm:text-2xl">
                Complete Your Profile
              </h1>
              <p className="text-sm text-slate-500">
                Tell us about your skills and location
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">
            <div>
              <label
                htmlFor="categoryId"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
                disabled={catLoading}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="">
                  {catLoading ? "Loading categories..." : "Select a category"}
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
                Profile Image
              </label>
              <div className="flex items-center gap-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-colors overflow-hidden sm:w-20 sm:h-20"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera size={18} className="text-slate-400 sm:w-5 sm:h-5" />
                  )}
                </div>
                <div className="text-xs text-slate-400">
                  <p>Click to upload</p>
                  <p>PNG, JPG up to 5MB</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="city"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={form.city}
                onChange={handleChange}
                placeholder="e.g. Cairo, Alexandria..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="nationalId"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                National ID
              </label>
              <input
                id="nationalId"
                name="nationalId"
                type="text"
                value={form.nationalId}
                onChange={handleChange}
                placeholder="Your national ID number"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="bio"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your experience, skills, and what you offer..."
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <motion.button
              type="submit"
              disabled={createProfile.isPending}
              className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-700 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {createProfile.isPending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Hammer size={18} />
              )}
              {createProfile.isPending
                ? "Creating Profile..."
                : "Complete Profile"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
