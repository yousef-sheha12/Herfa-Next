"use client";

import { useState, useEffect } from "react";
import {
  useGetClientProfile,
  useUpdateClientProfile,
} from "@/hooks/client/useClient";
import { useAuth } from "@/hooks/useApi";
import { Save, Loader2 } from "lucide-react";

export default function CustomerSettings() {
  const { user } = useAuth();
  const isCustomer = user?.role === "customer";
  const { data: profile, isLoading } = useGetClientProfile(isCustomer);
  const updateProfile = useUpdateClientProfile();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setEmail(profile.email || "");
    } else if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
  }, [profile, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      await updateProfile.mutateAsync({ username, email });
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 mt-20">
      <h1 className="mb-2 text-2xl font-bold text-slate-800">Settings</h1>
      <p className="mb-8 text-sm text-slate-500">
        Update your profile information
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label
            htmlFor="username"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        {error && (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
            Profile updated successfully
          </p>
        )}

        <button
          type="submit"
          disabled={updateProfile.isPending}
          className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-700 disabled:opacity-50"
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
  );
}
