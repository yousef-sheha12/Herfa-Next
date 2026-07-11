"use client";

import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";

export default function CategorySelect({ categories, isLoading, selected, onSelect, onNext }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6 sm:text-2xl">Select a Service Category</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {isLoading ? (
          <div className="col-span-2 flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          categories.map((cat, index) => (
            <motion.button
              key={cat.id}
              onClick={() => onSelect(cat.name)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl border-2 text-left transition-all ${selected === cat.name ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}`}
            >
              <h3 className="font-semibold text-gray-900">{cat.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{cat.description || "Professional service"}</p>
            </motion.button>
          ))
        )}
      </div>
      <div className="flex justify-end mt-8">
        <motion.button
          onClick={onNext}
          className="btn bg-primary text-white hover:bg-primary-dark"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Next Step <ArrowRight size={18} />
        </motion.button>
      </div>
    </div>
  );
}
