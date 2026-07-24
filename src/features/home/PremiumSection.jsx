"use client";

import { motion } from "framer-motion";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function PremiumSection({ onLogin }) {
  return (
    <section className="px-4 pb-14 sm:px-6 md:px-10 md:pb-16 lg:px-12 lg:pb-20">
      <ScrollReveal>
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[#d9cfbe] bg-[linear-gradient(135deg,#17302f_0%,#234746_40%,#b38b52_100%)] shadow-[0_28px_90px_rgba(24,48,47,0.18)] sm:rounded-[2.5rem]">
          <div className="grid gap-8 px-5 py-8 sm:px-6 md:px-10 md:py-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:px-14 lg:py-14">
            <div className="text-white">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#efe2c4] backdrop-blur">
                Herfa Signature
              </span>
              <h2 className="mt-6 max-w-2xl text-2xl font-black leading-[1.05] tracking-[-0.06em] sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                Premium craftsmanship,<br />reserved for homes<br />that deserve more.
              </h2>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/75 md:text-base">
                Unlock curated artisans, elevated finishing standards, and a smoother booking journey tailored to high-trust projects.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <motion.button onClick={onLogin} className="rounded-full bg-[#f3e2bd] px-7 py-3 text-sm font-bold text-[#243333] transition hover:bg-[#f8e9cb]" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Login To Continue
                </motion.button>
                <motion.button onClick={onLogin} className="rounded-full border border-white/20 bg-white/8 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/12" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Explore Premium Access
                </motion.button>
              </div>
            </div>

            <div className="relative">
              <motion.div className="rounded-[2rem] border border-white/15 bg-white/10 p-4 backdrop-blur-md sm:p-6" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
                <div className="rounded-[1.6rem] border border-white/10 bg-[#132727]/80 p-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-[#ceb98c]">Private Match</p>
                      <h3 className="mt-2 text-xl font-bold sm:text-2xl">Concierge artisan pairing</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-[#f3e2bd] text-[#203331] flex items-center justify-center text-lg font-black">H</div>
                  </div>
                  <div className="mt-8 space-y-4">
                    <motion.div className="rounded-2xl bg-white/6 px-4 py-4" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                      <p className="text-xs uppercase tracking-[0.25em] text-white/50">Finish level</p>
                      <p className="mt-1 text-lg font-semibold text-[#f8e8c9]">Signature detail package</p>
                    </motion.div>
                    <motion.div className="rounded-2xl bg-white/6 px-4 py-4" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
                      <p className="text-xs uppercase tracking-[0.25em] text-white/50">Availability</p>
                      <p className="mt-1 text-lg font-semibold text-[#9ce9d8]">Priority booking window</p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
              <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-[#f3e2bd]/30 blur-2xl" />
              <div className="absolute -right-4 -top-6 h-28 w-28 rounded-full bg-emerald-300/20 blur-2xl" />
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
