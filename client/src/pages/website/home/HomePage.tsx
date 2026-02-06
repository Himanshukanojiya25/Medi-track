import React from 'react';

import {
  WebsiteLayout,
  WebsiteHeader,
  WebsiteFooter,
  WebsiteSEO,
} from '../../../layouts';

export const HomePage: React.FC = () => {
  return (
    <WebsiteLayout>
      <WebsiteSEO
        title="MediTrack | Find Doctors & Hospitals"
        description="Discover trusted doctors and hospitals powered by AI."
      />

      <WebsiteHeader />

      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">
            Find the Right Doctor. Instantly.
          </h1>
          <p className="mt-4 text-lg text-blue-100">
            Discover trusted healthcare providers near you.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <a
              href="/doctors"
              className="rounded bg-white px-6 py-3 text-sm font-semibold text-blue-600"
            >
              Find Doctors
            </a>
            <a
              href="/ai-symptom"
              className="rounded border border-white px-6 py-3 text-sm font-semibold"
            >
              Check Symptoms
            </a>
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 grid gap-8 md:grid-cols-3 text-center">
          <div className="rounded bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-lg">Verified Doctors</h3>
            <p className="mt-2 text-sm text-gray-600">
              Trusted & certified healthcare professionals.
            </p>
          </div>

          <div className="rounded bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-lg">Smart AI Assistance</h3>
            <p className="mt-2 text-sm text-gray-600">
              AI powered symptom analysis & guidance.
            </p>
          </div>

          <div className="rounded bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-lg">Easy Appointments</h3>
            <p className="mt-2 text-sm text-gray-600">
              Book appointments in just a few clicks.
            </p>
          </div>
        </div>
      </section>

      <WebsiteFooter />
    </WebsiteLayout>
  );
};

export default HomePage;
