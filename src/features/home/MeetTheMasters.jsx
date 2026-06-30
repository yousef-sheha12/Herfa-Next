'use client'

import ArtisanCard from './ArtisanCard'

export default function MeetTheMasters({ masters = [], onBrowseAll, onBookNow, onViewProfile }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:px-10 md:py-16 lg:px-12 lg:py-20">
      <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-4 h-1.5 w-10 rounded-full bg-teal-700" />
          <h2 className="text-3xl font-black tracking-[-0.05em] text-slate-900 sm:text-4xl">
            Meet the Masters
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
            Handpicked professionals with a verified track record of excellence in every detail.
          </p>
        </div>

        <button
          onClick={onBrowseAll}
          className="text-sm font-bold text-teal-700 transition hover:text-teal-900"
        >
          Browse all specialists
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
        {masters[0] && (
          <ArtisanCard
            {...masters[0]}
            variant="featured"
            onBookNow={onBookNow}
            onViewProfile={onViewProfile}
          />
        )}

        <div className="flex flex-col gap-4">
          {masters.slice(1).map((master) => (
            <ArtisanCard
              key={master.id}
              {...master}
              onBookNow={onBookNow}
              onViewProfile={onViewProfile}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
