import React from 'react';

import {
  WebsiteLayout,
  WebsiteHeader,
  WebsiteFooter,
  WebsiteSEO,
} from '../../../layouts';

/**
 * AboutPage
 * ----------
 * Public about page for MediTrack.
 * - Static-first
 * - No API calls
 * - Content-focused
 */

export const AboutPage: React.FC = () => {
  return (
    <WebsiteLayout>
      <WebsiteSEO
        title="About MediTrack | Smart Healthcare Platform"
        description="Learn about MediTrack’s mission to simplify healthcare discovery with technology and AI."
      />

      <WebsiteHeader />

      {/* HERO */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h1 className="text-3xl font-bold">About MediTrack</h1>
          <p className="mt-4 text-lg text-gray-600">
            Building a smarter, faster and more accessible healthcare ecosystem.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 space-y-8 text-gray-700">
          <p>
            MediTrack is a healthcare discovery and management platform designed to
            connect patients with trusted doctors and hospitals effortlessly.
          </p>

          <p>
            Our mission is to reduce friction in healthcare access by combining
            intuitive design, reliable data, and AI-powered assistance.
          </p>

          <p>
            Whether you are searching for a specialist, booking an appointment,
            or checking symptoms using AI — MediTrack helps you take informed
            healthcare decisions.
          </p>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-blue-50 py-16">
        <div className="mx-auto max-w-5xl px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-lg font-semibold">Trust</h3>
            <p className="mt-2 text-sm text-gray-600">
              Verified doctors and hospitals you can rely on.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Technology</h3>
            <p className="mt-2 text-sm text-gray-600">
              Smart systems powered by modern software and AI.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Care</h3>
            <p className="mt-2 text-sm text-gray-600">
              Patient-first approach in everything we build.
            </p>
            
          </div>
        </div>
      </section>

      <WebsiteFooter />
    </WebsiteLayout>
  );
};

export default AboutPage;
