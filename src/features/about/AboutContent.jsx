"use client";

import { steps, values } from "@/lib/mockData/AboutMockData";
import { Wrench } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AboutContent() {
  const router = useRouter();
  return (
    <div className="bg-[#f7f4ef] pt-24 text-slate-800">
      <section className="px-4 pb-12 pt-8 sm:px-6 md:px-10 lg:px-12">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-[linear-gradient(135deg,#0f2f2c_0%,#1f5f59_45%,#e3c78f_100%)] px-5 py-8 text-white shadow-[0_30px_100px_rgba(15,47,44,0.16)] sm:px-6 md:px-10 md:py-10 lg:px-14 lg:py-14">
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#f3e1bd]">
            About Herfa
          </span>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
            <div>
              <h1 className="max-w-3xl text-3xl font-black leading-[1.05] tracking-[0.02em] sm:text-4xl md:text-5xl lg:text-6xl">
                Herfa connects skilled artisans with people who want their homes
                done right.
              </h1>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/78 md:text-base">
                The project is built to make home services feel more reliable,
                more elegant, and easier to manage. Instead of searching blindly
                for help, users can discover specialists, request services, and
                move into a smoother booking experience.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => router.push("/")}
                  className="rounded-full border border-white/20 bg-white/8 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/12"
                >
                  Back To Home
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/12 bg-white/10 p-6 backdrop-blur-md">
              <div className="rounded-[1.6rem] bg-[#112624]/80 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3e2bd] text-[#223332]">
                    <Wrench size={20} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#f3e2bd]">
                      Core Mission
                    </p>
                    <p className="mt-1 text-xl font-bold">
                      Reliable craftsmanship for modern homes
                    </p>
                  </div>
                </div>

                <p className="mt-6 text-sm leading-7 text-white/72">
                  Herfa is not just a listing page. It is a service experience
                  that helps customers discover trust and gives artisans a
                  better system to present their work and receive opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 md:px-10 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <div className="mb-4 h-1.5 w-12 rounded-full bg-teal-700" />
            <h2 className="text-3xl font-black tracking-[-0.05em] text-slate-900 sm:text-4xl">
              How Herfa Works
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-500 md:text-base">
              The flow is designed to feel simple: discover, choose, then manage
              the experience in one place.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.title}
                  className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-5 text-2xl font-bold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 md:px-10 lg:px-12">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:p-8 lg:p-12">
          <div className="max-w-2xl">
            <div className="mb-4 h-1.5 w-12 rounded-full bg-amber-500" />
            <h2 className="text-3xl font-black tracking-[-0.05em] text-slate-900 sm:text-4xl">
              Why This Project Matters
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-500 md:text-base">
              Home service work is often fragmented. Herfa aims to make the
              experience cleaner, more trustworthy, and more premium for
              everyone involved.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <article
                  key={value.title}
                  className="rounded-[1.8rem] bg-[#f8f5ef] p-6"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-800 shadow-sm">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-5 text-2xl font-bold text-slate-900">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {value.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 pb-14 pt-8 sm:px-6 md:px-10 lg:px-12 lg:pb-20">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-[#183734] px-5 py-8 text-white sm:px-6 md:px-10 md:py-10 lg:px-14 lg:py-12">
          <h2 className="max-w-3xl text-3xl font-bold leading-[1.05] tracking-[0.05em] sm:text-4xl md:text-5xl">
            Herfa is built to make home service journeys clearer and more
            dependable.
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/72 md:text-base">
            From discovery to booking and dashboard management, the platform is
            designed to give both customers and artisans a more organized
            experience.
          </p>
        </div>
      </section>
    </div>
  );
}
