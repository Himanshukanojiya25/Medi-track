import React from 'react';

import {
  WebsiteLayout,
  WebsiteHeader,
  WebsiteFooter,
  WebsiteSEO,
} from '../../../layouts';

/**
 * DoctorProfilePage
 * ------------------
 * Public doctor profile page.
 * - Static-first
 * - Mock data only
 * - No API calls
 * - Accessibility compliant
 */

export const DoctorProfilePage: React.FC = () => {
  return (
    <WebsiteLayout>
      <WebsiteSEO
        title="Dr. John Doe | Cardiologist | MediTrack"
        description="View profile, experience, and availability of Dr. John Doe, Cardiologist on MediTrack."
      />

      <WebsiteHeader />

      {/* PROFILE HEADER */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row gap-8">
          <div className="w-32 h-32 rounded-full bg-gray-300" aria-hidden="true" />

          <div>
            <h1 className="text-3xl font-bold">Dr. John Doe</h1>
            <p className="mt-1 text-lg text-gray-600">Cardiologist</p>
            <p className="mt-2 text-sm text-gray-500">
              10+ years experience • City Hospital
            </p>
          </div>
        </div>
      </section>

      {/* DETAILS */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ABOUT */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold">About Doctor</h2>
            <p className="mt-4 text-sm text-gray-700">
              Dr. John Doe is an experienced cardiologist specializing in
              preventive and interventional cardiology. He has treated
              thousands of patients with a patient-first approach.
            </p>
          </div>

          {/* ACTIONS */}
          <aside className="rounded border p-4">
            <h3 className="text-lg font-semibold">Book Appointment</h3>
            <p className="mt-2 text-sm text-gray-600">
              Consultation available at City Hospital.
            </p>

            <button
              className="mt-4 w-full rounded bg-blue-600 px-4 py-2 text-sm text-white opacity-70 cursor-not-allowed"
              type="button"
              aria-label="Book appointment (coming soon)"
            >
              Book Now (Coming Soon)
            </button>
          </aside>
        </div>
      </section>

      {/* INFO GRID */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-semibold">Specialization</h4>
            <p className="mt-1 text-sm text-gray-600">Cardiology</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Experience</h4>
            <p className="mt-1 text-sm text-gray-600">10+ Years</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Languages</h4>
            <p className="mt-1 text-sm text-gray-600">English, Hindi</p>
          </div>
        </div>
      </section>

      <WebsiteFooter />
    </WebsiteLayout>
  );
};

export default DoctorProfilePage;
