import React from 'react';

import {
  WebsiteLayout,
  WebsiteHeader,
  WebsiteFooter,
  WebsiteSEO,
} from '../../../layouts';

/**
 * ContactPage
 * ------------
 * Public contact page for MediTrack.
 * - Static-first
 * - UI-only contact form
 * - No API / no submission logic
 */

export const ContactPage: React.FC = () => {
  return (
    <WebsiteLayout>
      <WebsiteSEO
        title="Contact MediTrack | Get in Touch"
        description="Have questions or need support? Contact the MediTrack team."
      />

      <WebsiteHeader />

      {/* HERO */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <p className="mt-4 text-lg text-gray-600">
            We’d love to hear from you. Reach out anytime.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* INFO */}
          <div>
            <h2 className="text-xl font-semibold">Get in touch</h2>
            <p className="mt-4 text-sm text-gray-600">
              For general inquiries, partnerships, or support, use the form
              or reach us through the details below.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-gray-700">
              <li>Email: support@meditrack.com</li>
              <li>Phone: +91 90000 00000</li>
              <li>Location: India</li>
            </ul>
          </div>

          {/* FORM (UI ONLY) */}
          <div>
            <h2 className="text-xl font-semibold">Send a message</h2>

            <form className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded border px-3 py-2 text-sm"
                disabled
              />
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded border px-3 py-2 text-sm"
                disabled
              />
              <textarea
                placeholder="Your message"
                className="w-full rounded border px-3 py-2 text-sm"
                rows={4}
                disabled
              />
              <button
                type="button"
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white opacity-70 cursor-not-allowed"
              >
                Submit (Coming Soon)
              </button>
            </form>
          </div>
        </div>
      </section>

      <WebsiteFooter />
    </WebsiteLayout>
  );
};

export default ContactPage;
