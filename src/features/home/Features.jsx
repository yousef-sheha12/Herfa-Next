'use client'

export default function Features({ features = [] }) {
  return (
    <section className="border-t border-slate-200/80 bg-[#f1ede7]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-2 md:px-10 lg:grid-cols-3 lg:px-12 lg:py-16">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <article key={feature.title} className="flex flex-col gap-4">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full ${feature.iconBg}`}
              >
                <Icon size={28} className={feature.iconColor} />
              </div>
              <h3 className="text-xl text-slate-900 [word-spacing:6px]">
                {feature.title}
              </h3>
              <p className="max-w-sm text-sm leading-6 text-slate-500">
                {feature.description}
              </p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
