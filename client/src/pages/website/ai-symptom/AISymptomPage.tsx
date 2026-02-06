import React from 'react';

import {
  WebsiteLayout,
  WebsiteHeader,
  WebsiteFooter,
  WebsiteSEO,
} from '../../../layouts';

/**
 * AISymptomPage
 * --------------
 * Public AI Symptom Checker page.
 * - Static-first (UI only)
 * - No API calls
 * - Clear medical disclaimer
 * - Accessibility compliant
 */

export const AISymptomPage: React.FC = () => {
  return (
    <WebsiteLayout>
      <WebsiteSEO
        title="AI Symptom Checker | MediTrack"
        description="Check symptoms and get AI-powered health insights. For informational purposes only."
      />

      <WebsiteHeader />

      {/* HERO */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h1 className="text-3xl font-bold">AI Symptom Checker</h1>
          <p className="mt-4 text-lg text-gray-600">
            Get instant AI-powered health insights based on your symptoms.
          </p>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="py-8">
        <div className="mx-auto max-w-5xl px-4">
          <div
            className="rounded border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800"
            role="alert"
          >
            <strong>Disclaimer:</strong> This AI Symptom Checker is for
            informational purposes only and does not provide a medical diagnosis.
            Always consult a qualified healthcare professional.
          </div>
        </div>
      </section>

      {/* INPUT AREA (UI ONLY) */}
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-xl font-semibold">Describe your symptoms</h2>

          <div className="mt-4 space-y-4">
            <textarea
              className="w-full rounded border px-3 py-2 text-sm"
              rows={5}
              placeholder="Example: fever, headache, sore throat for 2 days"
              aria-label="Describe your symptoms"
              disabled
            />

            <button
              type="button"
              className="rounded bg-blue-600 px-4 py-2 text-sm text-white opacity-70 cursor-not-allowed"
              aria-label="Analyze symptoms with AI (coming soon)"
            >
              Analyze Symptoms (Coming Soon)
            </button>
          </div>
        </div>
      </section>

      {/* INFO CARDS */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-5xl px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded border p-4">
            <h3 className="text-sm font-semibold">Fast Insights</h3>
            <p className="mt-2 text-sm text-gray-600">
              Get quick AI-generated insights based on symptoms.
            </p>
          </div>

          <div className="rounded border p-4">
            <h3 className="text-sm font-semibold">Privacy First</h3>
            <p className="mt-2 text-sm text-gray-600">
              Your inputs are handled securely and responsibly.
            </p>
          </div>

          <div className="rounded border p-4">
            <h3 className="text-sm font-semibold">Doctor Guidance</h3>
            <p className="mt-2 text-sm text-gray-600">
              AI suggestions encourage consulting verified doctors.
            </p>
          </div>
        </div>
      </section>

      <WebsiteFooter />
    </WebsiteLayout>
  );
};

export default AISymptomPage;
