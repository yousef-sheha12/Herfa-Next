"use client";

import { ArrowRight, Loader2 } from "lucide-react";

export default function CategorySelect({ categories, isLoading, selected, onSelect, onNext }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Service Category</h2>
      <div className="grid grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-2 flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          categories.map((cat) => (
            <button key={cat.id} onClick={() => onSelect(cat.name)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${selected === cat.name ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}`}>
              <h3 className="font-semibold text-gray-900">{cat.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{cat.description || "Professional service"}</p>
            </button>
          ))
        )}
      </div>
      <div className="flex justify-end mt-8">
        <button onClick={onNext} className="btn bg-primary text-white hover:bg-primary-dark">
          Next Step <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
