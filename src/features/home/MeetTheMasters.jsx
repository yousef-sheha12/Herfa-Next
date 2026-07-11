"use client";

import { motion } from "framer-motion";
import ArtisanCard from "./ArtisanCard";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function MeetTheMasters({
  masters = [],
  onBookNow,
  onViewProfile,
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:px-10 md:py-16 lg:px-12 lg:py-20">
      <ScrollReveal>
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 h-1.5 w-10 rounded-full bg-teal-700" />
            <h2 className="text-2xl font-black tracking-[-0.05em] text-slate-900 sm:text-3xl md:text-4xl">
              Meet the Masters
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
              Handpicked professionals with a verified track record of excellence
              in every detail.
            </p>
          </div>
        </div>
      </ScrollReveal>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
        {masters[0] && (
          <ScrollReveal direction="left" delay={0.1}>
            <ArtisanCard
              {...masters[0]}
              variant="featured"
              onBookNow={onBookNow}
              onViewProfile={onViewProfile}
            />
          </ScrollReveal>
        )}

        <div className="flex flex-col gap-4">
          {masters.slice(1).map((master, index) => (
            <ScrollReveal key={master.id} direction="right" delay={0.2 + index * 0.15}>
              <ArtisanCard
                {...master}
                onBookNow={onBookNow}
                onViewProfile={onViewProfile}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
