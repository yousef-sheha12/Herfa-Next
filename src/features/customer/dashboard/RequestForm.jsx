"use client";

import { useState } from "react";
import { useGetCategories } from "@/hooks/category/useCategory";
import { useCreateRequest } from "@/hooks/requests/useRequests";
import { useToast } from "@/hooks/useToast";
import StepIndicator from "@/features/booking/StepIndicator";
import CategorySelect from "@/features/booking/CategorySelect";
import RequestDetails from "@/features/booking/RequestDetails";
import SubmissionSuccess from "@/features/booking/SubmissionSuccess";

export default function RequestForm() {
  const toast = useToast();
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategories();
  const createReq = useCreateRequest();

  const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData?.data || [];
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [urgency, setUrgency] = useState("standard");

  const handleNext = () => {
    if (step === 1 && !category) { toast.error("Please select a service category"); return; }
    if (step === 2 && !description.trim()) { toast.error("Please describe your service needs"); return; }
    setStep((s) => Math.min(s + 1, 3));
  };

  const handleSubmit = async () => {
    try {
      const selected = categories.find((c) => c.name === category);
      await createReq.mutateAsync({ title: category, categoryId: selected?.id || 0, description, address, imageUrl: "" });
      toast.success("Request submitted!");
      setStep(3);
    } catch (err) {
      const serverMsg = err?.response?.data?.message || err?.response?.data?.title || err?.response?.data?.detail;
      const status = err?.response?.status;
      toast.error(status ? `Error ${status}: ${serverMsg || "Server error"}` : (err?.message || "Failed to submit request"));
    }
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <StepIndicator currentStep={step} />

      {step === 1 && (
        <CategorySelect categories={categories} isLoading={categoriesLoading} selected={category} onSelect={setCategory} onNext={handleNext} />
      )}

      {step === 2 && (
        <RequestDetails
          description={description} address={address} urgency={urgency}
          isPending={createReq.isPending}
          onChange={(field, value) => {
            if (field === "description") setDescription(value);
            if (field === "address") setAddress(value);
            if (field === "urgency") setUrgency(value);
          }}
          onBack={() => setStep((s) => Math.max(s - 1, 1))}
          onSubmit={handleSubmit}
        />
      )}

      {step === 3 && <SubmissionSuccess />}
    </div>
  );
}
