import React from 'react';

import {
  WebsiteLayout,
  WebsiteHeader,
  WebsiteFooter,
  WebsiteSEO,
} from '../../../layouts';

/**
 * HospitalProfilePage
 * --------------------
 * Public hospital profile page.
 * - Static-first
 * - Mock data only
 * - No API calls
 * - Accessibility compliant
 */

export const HospitalProfilePage: React.FC = () => {
  return (
    <WebsiteLayout>
      <WebsiteSEO
        title="City Care Hospital | Multi-Specialty Hospital | MediTrack"
        description="View facilities, specialties, and doctors at City Care Hospital on MediTrack."
      />

      <WebsiteHeader />

      {/* PROFILE HEADER */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row gap-8">
          <div
            className="w-32 h-32 rounded bg-gray-300"
            aria-hidden="true"
          />

          <div>
            <h1 className="text-3xl font-bold">City Care Hospital</h1>
            <p className="mt-1 text-lg text-gray-600">
              Multi-Specialty Hospital
            </p>
            <p className="mt-2 text-sm text-gray-500">
              24x7 Emergency • ICU • Diagnostics
            </p>
          </div>
        </div>
      </section>

      {/* DETAILS */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ABOUT */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold">About Hospital</h2>
            <p className="mt-4 text-sm text-gray-700">
              City Care Hospital is a modern healthcare facility providing
              comprehensive medical services across multiple specialties.
              With advanced infrastructure and experienced doctors, the
              hospital focuses on quality patient care.
            </p>
          </div>

          {/* ACTIONS */}
          <aside className="rounded border p-4">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <p className="mt-2 text-sm text-gray-600">
              Explore doctors and services available at this hospital.
            </p>

            <button
              className="mt-4 w-full rounded bg-blue-600 px-4 py-2 text-sm text-white opacity-70 cursor-not-allowed"
              type="button"
              aria-label="View doctors at hospital (coming soon)"
            >
              View Doctors (Coming Soon)
            </button>
          </aside>
        </div>
      </section>

      {/* INFO GRID */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-semibold">Location</h4>
            <p className="mt-1 text-sm text-gray-600">Downtown, City</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Departments</h4>
            <p className="mt-1 text-sm text-gray-600">
              Cardiology, Neurology, Orthopedics
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Established</h4>
            <p className="mt-1 text-sm text-gray-600">2005</p>
          </div>
        </div>
      </section>

      <WebsiteFooter />
    </WebsiteLayout>
  );
};

export default HospitalProfilePage;
