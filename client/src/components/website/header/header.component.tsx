import { Link } from "react-router-dom";

export function WebsiteHeader() {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600">
            Medi<span className="text-slate-900">Track</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/doctors" className="hover:text-blue-600">
            Doctors
          </Link>
          <Link to="/hospitals" className="hover:text-blue-600">
            Hospitals
          </Link>
          <Link to="/about" className="hover:text-blue-600">
            About
          </Link>
          <Link to="/faq" className="hover:text-blue-600">
            Help
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-700 hover:text-blue-600"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
