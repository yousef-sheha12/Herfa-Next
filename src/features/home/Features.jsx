'use client'

import ScrollReveal from "@/components/ui/ScrollReveal";

export default function Features({ features = [] }) {
  return (
    <section className="border-t border-slate-200/80 bg-[#f1ede7]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-2 md:px-10 lg:grid-cols-3 lg:px-12 lg:py-16">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <ScrollReveal key={feature.title} delay={index * 0.12} direction="up">
              <article className="flex flex-col gap-4 hover-lift rounded-3xl bg-white/50 p-6">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${feature.iconBg} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon size={26} className={feature.iconColor} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 sm:text-xl [word-spacing:6px]">
                  {feature.title}
                </h3>
                <p className="max-w-sm text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>
              </article>
            </ScrollReveal>
          )
        })}
      </div>
    </section>
  )
}
