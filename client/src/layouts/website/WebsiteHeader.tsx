import React from 'react';

export const WebsiteHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <div className="text-xl font-bold text-blue-600">
          MediTrack
        </div>

        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <a href="/" className="hover:text-blue-600">Home</a>
          <a href="/doctors" className="hover:text-blue-600">Doctors</a>
          <a href="/hospitals" className="hover:text-blue-600">Hospitals</a>
          <a href="/ai-symptom" className="hover:text-blue-600">AI Symptom</a>
          <a href="/contact" className="hover:text-blue-600">Contact</a>
        </nav>

        <div className="flex gap-3">
          <a
            href="/login"
            className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Login
          </a>
          <a
            href="/signup"
            className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Sign Up
          </a>
        </div>
      </div>
    </header>
  );
};

export default WebsiteHeader;
