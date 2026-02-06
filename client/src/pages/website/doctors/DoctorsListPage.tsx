import React from 'react';

import {
  WebsiteLayout,
  WebsiteHeader,
  WebsiteFooter,
  WebsiteSEO,
} from '../../../layouts';

export const DoctorsListPage: React.FC = () => {
  return (
    <WebsiteLayout>
      <WebsiteSEO
        title="Find Doctors Near You | MediTrack"
        description="Browse verified doctors across specialties."
      />

      <WebsiteHeader />

      {/* HERO */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-3xl font-bold">Find Doctors</h1>
          <p className="mt-2 text-gray-600">
            Discover trusted doctors across specialties.
          </p>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            aria-label="Search doctors"
            placeholder="Search by name or specialty"
            className="w-full md:flex-1 rounded border px-3 py-2 text-sm"
            disabled
          />

          <select
            aria-label="Filter by specialty"
            className="rounded border px-3 py-2 text-sm"
            disabled
          >
            <option>All Specialties</option>
          </select>

          <button
            type="button"
            className="rounded bg-blue-600 px-4 py-2 text-sm text-white opacity-70 cursor-not-allowed"
          >
            Search
          </button>
        </div>
      </section>

      {/* GRID */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 grid gap-6 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((id) => (
            <div
              key={id}
              className="rounded-lg border bg-white p-5 hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold">Dr. John Doe</h3>
              <p className="text-sm text-gray-600">Cardiologist</p>
              <p className="mt-2 text-xs text-gray-500">10+ years experience</p>

              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  Available
                </span>
                <a
                  href="/doctor-profile"
                  className="text-sm text-blue-600 hover:underline"
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

export default DoctorsListPage;
