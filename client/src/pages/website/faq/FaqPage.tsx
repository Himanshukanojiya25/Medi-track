import React from 'react';

import {
  WebsiteLayout,
  WebsiteHeader,
  WebsiteFooter,
  WebsiteSEO,
} from '../../../layouts';

/**
 * FaqPage
 * --------
 * Public FAQ / Help Center page.
 * - Static-first
 * - No API
 * - SEO friendly
 */

export const FaqPage: React.FC = () => {
  return (
    <WebsiteLayout>
      <WebsiteSEO
        title="FAQ | MediTrack Help Center"
        description="Find answers to common questions about MediTrack, appointments, doctors, hospitals, and AI features."
      />

      <WebsiteHeader />

      {/* HERO */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
          <p className="mt-4 text-lg text-gray-600">
            Quick answers to common questions about MediTrack.
          </p>
        </div>
      </section>

      {/* FAQ LIST */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 space-y-8">
          <div>
            <h3 className="text-lg font-semibold">
              What is MediTrack?
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              MediTrack is a healthcare discovery and management platform that
              helps patients find doctors, hospitals, and get AI-powered health insights.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              Can I book appointments online?
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Yes. MediTrack allows patients to book appointments with doctors
              and hospitals directly through the platform.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              Is the AI Symptom Checker a medical diagnosis?
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              No. The AI Symptom Checker provides informational insights only
              and should not be considered a medical diagnosis.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              Is MediTrack free to use?
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Basic features are free for patients. Some advanced features
              may require a subscription in the future.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              How can I contact support?
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              You can reach our support team through the Contact page.
            </p>
          </div>
        </div>
      </section>

      <WebsiteFooter />
    </WebsiteLayout>
  );
};

export default FaqPage;
