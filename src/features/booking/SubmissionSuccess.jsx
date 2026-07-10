"use client";

import { Check } from "lucide-react";
import Link from "next/link";

export default function SubmissionSuccess({ onGoToDashboard }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check size={40} className="text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h2>
      <p className="text-gray-500 mb-8">
        Your service request has been submitted successfully. An artisan will be assigned to you shortly.
      </p>
      <div className="flex justify-center gap-4">
        <Link href="/" className="btn btn-ghost text-gray-600">Back to Home</Link>
        {onGoToDashboard && (
          <button onClick={onGoToDashboard} className="btn bg-primary text-white hover:bg-primary-dark">Go to Dashboard</button>
        )}
      </div>
    </div>
  );
}
