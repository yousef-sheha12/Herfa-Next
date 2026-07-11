"use client";

import { FileText } from "lucide-react";

export default function TermsContent() {
  return (
    <div className="bg-[#f7f4ef] pt-24 text-slate-800 min-h-screen">
      <section className="px-4 pb-12 pt-8 sm:px-6 md:px-10 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg">
              <FileText size={26} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-[-0.05em] text-slate-900 sm:text-4xl">
                Terms of Service
              </h1>
              <p className="mt-1 text-sm text-slate-500">Last updated: July 2026</p>
            </div>
          </div>

          <div className="space-y-8">
            <PolicySection title="1. Acceptance of Terms">
              <p>
                By accessing or using the Herfa platform, you agree to be bound by these
                Terms of Service. If you do not agree, please do not use our services.
              </p>
            </PolicySection>

            <PolicySection title="2. User Accounts">
              <p>
                You must provide accurate and complete information when creating an account.
                You are responsible for maintaining the security of your account credentials
                and for all activities that occur under your account.
              </p>
            </PolicySection>

            <PolicySection title="3. Services">
              <p>
                Herfa acts as a platform connecting customers with independent artisans.
                We are not a party to any agreement between customers and artisans and
                do not guarantee the quality, safety, or legality of services provided.
              </p>
            </PolicySection>

            <PolicySection title="4. User Conduct">
              <p>
                Users must behave respectfully and honestly on the platform. Harassment,
                fraud, misrepresentation, or any form of abusive behavior will result
                in account suspension or termination.
              </p>
            </PolicySection>

            <PolicySection title="5. Payments">
              <p>
                Payment terms will be agreed upon between the customer and artisan.
                Herfa is not responsible for handling payments directly unless explicitly
                stated in the booking flow.
              </p>
            </PolicySection>

            <PolicySection title="6. Limitation of Liability">
              <p>
                Herfa shall not be liable for any indirect, incidental, or consequential
                damages arising from the use of our platform. Our total liability shall
                not exceed the amount paid by you in the last 12 months.
              </p>
            </PolicySection>

            <PolicySection title="7. Contact Us">
              <p>
                For questions regarding these Terms, reach out at
                <span className="font-semibold text-emerald-600"> terms@herfa.com</span>.
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
