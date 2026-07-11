"use client";

import { motion } from "framer-motion";
import Link from 'next/link'
import MainLayout from '@/components/layout/MainLayout'

export default function NotFoundPage() {
  return (
    <MainLayout>
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-5xl sm:text-6xl font-bold text-primary mb-4"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            404
          </motion.h1>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
          <p className="text-gray-500 mb-8 text-sm sm:text-base">The page you're looking for doesn't exist or has been moved.</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/" className="btn bg-primary text-white hover:bg-primary-dark">
              Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </MainLayout>
  )
}
