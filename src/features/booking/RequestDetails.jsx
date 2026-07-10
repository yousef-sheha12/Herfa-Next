"use client";

import { ArrowLeft, Loader2 } from "lucide-react";

export default function RequestDetails({ description, address, urgency, isPending, onChange, onBack, onSubmit }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Describe Your Needs</h2>
      <div className="space-y-4">
        <div className="form-control">
          <label className="label"><span className="label-text text-gray-700">Service Description</span></label>
          <textarea value={description} onChange={(e) => onChange("description", e.target.value)}
            placeholder="Describe what needs to be done..." rows={5}
            className="textarea textarea-bordered bg-white text-gray-900 resize-none" />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text text-gray-700">Address</span></label>
          <input type="text" value={address} onChange={(e) => onChange("address", e.target.value)}
            placeholder="e.g. 123 Main St, City" className="input input-bordered bg-white text-gray-900" />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text text-gray-700">Urgency</span></label>
          <div className="flex gap-3">
            {["standard", "urgent"].map((u) => (
              <button key={u} onClick={() => onChange("urgency", u)}
                className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${urgency === u ? "border-primary bg-primary/5" : "border-gray-200"}`}>
                <span className="font-medium text-gray-900 capitalize">{u}</span>
                <p className="text-sm text-gray-500 mt-1">{u === "standard" ? "Within 3-5 days" : "Within 24 hours"}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <button onClick={onBack} className="btn btn-ghost text-gray-600"><ArrowLeft size={18} /> Back</button>
        <button onClick={onSubmit} disabled={isPending} className="btn bg-primary text-white hover:bg-primary-dark disabled:opacity-50">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Submit Request
        </button>
      </div>
    </div>
  );
}
