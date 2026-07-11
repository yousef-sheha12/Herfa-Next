"use client";

import { HelpCircle, Mail, MessageCircle, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HelpContent() {
  const router = useRouter();

  const faqs = [
    {
      q: "How do I create a service request?",
      a: "Simply log in to your account, navigate to the Booking page, select a category, and fill in the request details. Your request will be sent to available artisans.",
    },
    {
      q: "How do I become an artisan on Herfa?",
      a: "Sign up with the Artisan role, then complete your profile from the Artisan Dashboard. Add your expertise, portfolio, and pricing to start receiving requests.",
    },
    {
      q: "Can I edit my profile after registration?",
      a: "Yes! Both customers and artisans can update their profile information, including personal details, profile picture, and preferences at any time.",
    },
    {
      q: "How are service requests matched?",
      a: "When a customer submits a request, it is routed to artisans in the selected category. Artisans can review and accept requests that match their skills.",
    },
    {
      q: "Is my personal information safe?",
      a: "We take privacy seriously. Your data is encrypted and never shared with third parties without your consent. See our Privacy Policy for details.",
    },
  ];

  return (
    <div className="bg-[#f7f4ef] pt-24 text-slate-800 min-h-screen">
      <section className="px-4 pb-12 pt-8 sm:px-6 md:px-10 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg">
              <HelpCircle size={26} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-[-0.05em] text-slate-900 sm:text-4xl">
                Help Center
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Find answers to common questions
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 mb-10">
            <ContactCard
              Icon={Mail}
              title="Email Us"
              desc="support@herfa.com"
            />
            <ContactCard
              Icon={MessageCircle}
              title="Live Chat"
              desc="Available 9am - 5pm"
            />
            <ContactCard
              Icon={BookOpen}
              title="Documentation"
              desc="Browse our guides"
            />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-base font-bold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-sm leading-7 text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactCard({ Icon, title, desc }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
        <Icon size={20} />
      </div>
      <h3 className="mt-3 font-bold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{desc}</p>
    </div>
  );
}
