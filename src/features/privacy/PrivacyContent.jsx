"use client";

import { Shield } from "lucide-react";

export default function PrivacyContent() {
  return (
    <div className="bg-[#f7f4ef] pt-24 text-slate-800 min-h-screen">
      <section className="px-4 pb-12 pt-8 sm:px-6 md:px-10 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg">
              <Shield size={26} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-[-0.05em] text-slate-900 sm:text-4xl">
                Privacy Policy
              </h1>
              <p className="mt-1 text-sm text-slate-500">Last updated: July 2026</p>
            </div>
          </div>

          <div className="space-y-8">
            <PolicySection title="1. Information We Collect">
              <p>
                When you use Herfa, we collect information you provide directly, such as your
                name, email address, phone number, and location when you create an account or
                request a service. We also collect usage data including pages visited, actions
                taken, and device information.
              </p>
            </PolicySection>

            <PolicySection title="2. How We Use Your Information">
              <p>
                We use the information to provide and improve our services, connect customers
                with artisans, process transactions, send service-related communications,
                and ensure platform security. We do not sell your personal data to third parties.
              </p>
            </PolicySection>

            <PolicySection title="3. Information Sharing">
              <p>
                Your profile information may be visible to other users on the platform for
                service purposes. We share data with artisans only when you submit a service
                request. We may share information with service providers who assist in
                operating the platform under strict confidentiality agreements.
              </p>
            </PolicySection>

            <PolicySection title="4. Data Security">
              <p>
                We implement industry-standard security measures to protect your personal
                information. However, no method of transmission over the Internet is 100%
                secure, and we cannot guarantee absolute security.
              </p>
            </PolicySection>

            <PolicySection title="5. Your Rights">
              <p>
                You have the right to access, correct, or delete your personal data. You can
                manage your information through your account settings or by contacting us
                directly. You may also opt out of non-essential communications.
              </p>
            </PolicySection>

            <PolicySection title="6. Contact Us">
              <p>
                If you have any questions about this Privacy Policy, please contact us at
                <span className="font-semibold text-emerald-600"> privacy@herfa.com</span>.
              </p>
            </PolicySection>
          </div>
        </div>
      </section>
    </div>
  );
}

function PolicySection({ title, children }) {
  return (
    <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-3">{title}</h2>
      <div className="text-sm leading-7 text-slate-600">{children}</div>
    </div>
  );
}
