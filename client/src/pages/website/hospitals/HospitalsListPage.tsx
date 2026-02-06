import React from 'react';

import {
  WebsiteLayout,
  WebsiteHeader,
  WebsiteFooter,
  WebsiteSEO,
} from '../../../layouts';

/**
 * HospitalsListPage
 * ------------------
 * Public hospitals listing page.
 * - Static-first
 * - UI-only filters & cards
 * - No API calls
 * - Accessibility compliant
 */

export const HospitalsListPage: React.FC = () => {
  return (
    <WebsiteLayout>
      <WebsiteSEO
        title="Find Hospitals Near You | MediTrack"
        description="Browse and discover verified hospitals with facilities and specialties on MediTrack."
      />

      <WebsiteHeader />

      {/* HERO */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-3xl font-bold">Find Hospitals</h1>
          <p className="mt-2 text-gray-600">
            Discover hospitals with trusted care and modern facilities.
          </p>
        </div>
      </section>

      {/* FILTER BAR (UI ONLY) */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by hospital name or location"
            className="w-full md:flex-1 rounded border px-3 py-2 text-sm"
            aria-label="Search hospitals by name or location"
            disabled
          />

          <select
            className="rounded border px-3 py-2 text-sm"
            aria-label="Filter hospitals by specialty"
            disabled
          >
            <option>All Specialties</option>
          </select>

          <button
            className="rounded bg-blue-600 px-4 py-2 text-sm text-white opacity-70 cursor-not-allowed"
            type="button"
            aria-label="Search hospitals"
          >
            Search
          </button>
        </div>
      </section>

      {/* HOSPITALS GRID (MOCK) */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="rounded border p-4 hover:shadow-sm transition"
            >
              <h3 className="text-lg font-semibold">City Care Hospital</h3>
              <p className="mt-1 text-sm text-gray-600">
                Multi-Specialty Hospital
              </p>
              <p className="mt-2 text-sm text-gray-500">
                24x7 Emergency • ICU • Diagnostics
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Location: Downtown
              </p>
              <div className="mt-4">
                <a
                  href="/hospital-profile"
                  className="text-sm text-blue-600 hover:underline"
                  aria-label="View hospital profile"
                >
                  View Profile
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <WebsiteFooter />
    </WebsiteLayout>
  );
};

export default HospitalsListPage;
