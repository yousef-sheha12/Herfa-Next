"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Hammer } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useApi";
import { useGetCategories } from "@/hooks/category/useCategory";
import { useCreateRequest } from "@/hooks/requests/useRequests";
import StepIndicator from "./StepIndicator";
import CategorySelect from "./CategorySelect";
import RequestDetails from "./RequestDetails";
import SubmissionSuccess from "./SubmissionSuccess";

export default function BookingFlow() {
  const toast = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const preselectedService = searchParams.get("service");

  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategories();
  const createRequestMutation = useCreateRequest();

  const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData?.data || [];
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [urgency, setUrgency] = useState("standard");

  useEffect(() => {
    if (preselectedService && categories.length > 0 && !category) {
      const match = categories.find(
        (c) => c.name?.toLowerCase() === preselectedService.toLowerCase()
      );
      if (match) setCategory(match.name);
    }
  }, [preselectedService, categories, category]);

  if (user?.role === "artisan") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Hammer size={40} className="text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Artisan Account</h2>
          <p className="text-gray-500 mb-8">
            Service requests can only be created from a customer account. Please switch to a customer account or visit your dashboard to manage incoming requests.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/" className="btn btn-ghost text-gray-600">Back to Home</Link>
            <Link href="/artisan/dashboard" className="btn bg-primary text-white hover:bg-primary-dark">Go to Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (step === 1 && !category) { toast.error("Please select a service category"); return; }
    if (step === 2 && !description.trim()) { toast.error("Please describe your service needs"); return; }
    setStep((s) => Math.min(s + 1, 3));
  };

  const handleSubmit = async () => {
    try {
      const selected = categories.find((c) => c.name === category);
      await createRequestMutation.mutateAsync({ title: category, categoryId: selected?.id || 0, description, address, imageUrl: "" });
      toast.success("Request submitted!");
      setStep(3);
    } catch (err) {
      const serverMsg = err?.response?.data?.message || err?.response?.data?.title || err?.response?.data?.detail;
      const status = err?.response?.status;
      toast.error(status ? `Error ${status}: ${serverMsg || "Server error"}` : (err?.message || "Failed to submit request"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-2xl mx-auto px-4">
        <StepIndicator currentStep={step} />

        {step === 1 && (
          <CategorySelect categories={categories} isLoading={categoriesLoading} selected={category} onSelect={setCategory} onNext={handleNext} />
        )}

        {step === 2 && (
          <RequestDetails
            description={description} address={address} urgency={urgency}
            isPending={createRequestMutation.isPending}
            onChange={(field, value) => {
              if (field === "description") setDescription(value);
              if (field === "address") setAddress(value);
              if (field === "urgency") setUrgency(value);
            }}
            onBack={() => setStep((s) => Math.max(s - 1, 1))}
            onSubmit={handleSubmit}
          />
        )}

        {step === 3 && (
          <SubmissionSuccess onGoToDashboard={() => router.push("/customer/dashboard")} />
        )}
      </div>
    </div>
  );
}
