"use client";

import { Check } from "lucide-react";

const steps = [
  { id: 1, label: "Category" },
  { id: 2, label: "Details" },
  { id: 3, label: "Confirm" },
];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
            currentStep > i + 1 ? "bg-primary text-white" : currentStep === i + 1 ? "bg-primary text-white ring-4 ring-primary/20" : "bg-gray-200 text-gray-500"
          }`}>
            {currentStep > i + 1 ? <Check size={18} /> : s.id}
          </div>
          {i < steps.length - 1 && (
            <div className={`w-16 sm:w-24 h-1 mx-2 rounded ${currentStep > i + 1 ? "bg-primary" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
