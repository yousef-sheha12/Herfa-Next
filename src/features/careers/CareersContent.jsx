"use client";

import { Briefcase, Code, Users, Megaphone } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CareersContent() {
  const router = useRouter();

  const openings = [
    {
      icon: Code,
      title: "Full-Stack Developer",
      type: "Remote / Full-time",
      description:
        "Build and maintain the Herfa platform using Next.js, .NET, and modern web technologies.",
    },
    {
      icon: Users,
      title: "Community Manager",
      type: "Remote / Part-time",
      description:
        "Engage with our growing community of artisans and customers to improve the platform experience.",
    },
    {
      icon: Megaphone,
      title: "Marketing Specialist",
      type: "Hybrid / Full-time",
      description:
        "Drive growth through digital marketing campaigns, social media, and partnership strategies.",
    },
  ];

  const perks = [
    "Flexible working hours",
    "Remote-first culture",
    "Learning & development budget",
    "Health insurance",
    "Annual team retreats",
    "Latest tech equipment",
  ];

  return (
    <div className="bg-[#f7f4ef] pt-24 text-slate-800 min-h-screen">
      <section className="px-4 pb-12 pt-8 sm:px-6 md:px-10 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg">
              <Briefcase size={26} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-[-0.05em] text-slate-900 sm:text-4xl">
                Careers at Herfa
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Help us build the future of home services
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] bg-gradient-to-br from-[#0f2f2c] to-[#1f5f59] p-8 text-white mt-6 mb-10">
            <h2 className="text-2xl font-bold mb-3">Why Work With Us?</h2>
            <p className="text-sm leading-7 text-white/78 max-w-2xl">
              Herfa is on a mission to make home services reliable and accessible. We are a
              small, passionate team that values craftsmanship, trust, and innovation.
              Join us in shaping how people connect with skilled professionals.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-6">Open Positions</h2>
          <div className="space-y-4 mb-10">
            {openings.map((job) => (
              <div
                key={job.title}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm flex items-start gap-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <job.icon size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                  <p className="text-xs font-medium text-emerald-600 mt-1">{job.type}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{job.description}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-6">Perks & Benefits</h2>
          <div className="grid gap-3 sm:grid-cols-2 mb-10">
            {perks.map((perk) => (
              <div
                key={perk}
                className="flex items-center gap-3 rounded-[1.2rem] border border-slate-200 bg-white px-5 py-3 shadow-sm"
              >
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium text-slate-700">{perk}</span>
              </div>
            ))}
          </div>

          <div className="rounded-[2rem] bg-[#183734] p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Don&apos;t see a role for you?</h2>
            <p className="text-sm text-white/70 mb-6">
              Send us your resume and we&apos;ll keep you in mind for future openings.
            </p>
            <button
              onClick={() => router.push("/")}
              className="rounded-full border border-white/20 bg-white/10 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Back to Home
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
