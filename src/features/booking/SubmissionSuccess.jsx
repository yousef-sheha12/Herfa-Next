"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

export default function SubmissionSuccess({ onGoToDashboard }) {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center sm:p-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <Check size={40} className="text-primary" />
      </motion.div>
      <h2 className="text-xl font-bold text-gray-900 mb-2 sm:text-2xl">Request Sent!</h2>
      <p className="text-gray-500 mb-8 text-sm sm:text-base">
        Your service request has been submitted successfully. An artisan will be assigned to you shortly.
      </p>
      <div className="flex flex-col gap-3 justify-center sm:flex-row">
        <Link href="/" className="btn btn-ghost text-gray-600">Back to Home</Link>
        {onGoToDashboard && (
          <motion.button onClick={onGoToDashboard} className="btn bg-primary text-white hover:bg-primary-dark" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            Go to Dashboard
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
