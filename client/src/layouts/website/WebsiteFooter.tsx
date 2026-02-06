import React from 'react';

export const WebsiteFooter: React.FC = () => {
  return (
    <footer className="mt-16 border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 grid gap-8 md:grid-cols-3 text-sm">
        <div>
          <h4 className="font-semibold mb-2">MediTrack</h4>
          <p className="text-gray-600">
            Smart healthcare discovery & management platform.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Explore</h4>
          <ul className="space-y-1 text-gray-600">
            <li>Doctors</li>
            <li>Hospitals</li>
            <li>AI Symptom Checker</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Legal</h4>
          <ul className="space-y-1 text-gray-600">
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>
      </div>

      <div className="border-t py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} MediTrack. All rights reserved.
      </div>
    </footer>
  );
};

export default WebsiteFooter;
