import { Link } from "react-router-dom";

export function WebsiteFooter() {
  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h3 className="text-lg font-semibold mb-3">MediTrack</h3>
          <p className="text-sm opacity-80">
            Find trusted doctors, hospitals, and medical care — powered by
            intelligent healthcare technology.
          </p>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:underline">About</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            <li><Link to="/faq" className="hover:underline">FAQ</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:underline">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Trust */}
        <div>
          <h4 className="font-semibold mb-3">Trust & Safety</h4>
          <p className="text-sm opacity-80">
            We follow strict data protection and healthcare compliance standards.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-700 py-4 text-center text-xs opacity-70">
        © {new Date().getFullYear()} MediTrack. All rights reserved.
      </div>
    </footer>
  );
}
