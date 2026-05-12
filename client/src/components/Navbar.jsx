import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-black tracking-tight" onClick={closeMobile}>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Smart
              </span>
              Event
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-text font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/events" className="text-text font-medium hover:text-primary transition-colors">
              Events
            </Link>

            {user ? (
              <>
                <Link to="/dashboard" className="text-text font-medium hover:text-primary transition-colors">
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <>
                    <Link to="/add-event" className="text-text font-medium hover:text-primary transition-colors">
                      Add Event
                    </Link>
                    <Link to="/admin-dashboard" className="text-text font-medium hover:text-primary transition-colors">
                      Admin
                    </Link>
                  </>
                )}
                <div className="flex items-center gap-4 border-l pl-6 border-slate-200">
                  <span className="text-sm font-semibold text-text-muted">
                    Hi, {user.name.split(' ')[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-text font-medium hover:text-primary transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-text text-white px-5 py-2 rounded-full font-medium hover:bg-primary transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="px-4 py-4 space-y-3">
            <Link to="/" className="block py-2 text-text font-medium hover:text-primary transition-colors" onClick={closeMobile}>
              Home
            </Link>
            <Link to="/events" className="block py-2 text-text font-medium hover:text-primary transition-colors" onClick={closeMobile}>
              Events
            </Link>

            {user ? (
              <>
                <Link to="/dashboard" className="block py-2 text-text font-medium hover:text-primary transition-colors" onClick={closeMobile}>
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <>
                    <Link to="/add-event" className="block py-2 text-text font-medium hover:text-primary transition-colors" onClick={closeMobile}>
                      Add Event
                    </Link>
                    <Link to="/admin-dashboard" className="block py-2 text-text font-medium hover:text-primary transition-colors" onClick={closeMobile}>
                      Admin Panel
                    </Link>
                  </>
                )}
                <div className="border-t border-slate-100 pt-3 mt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-text-muted">
                    Hi, {user.name.split(' ')[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-slate-100 pt-3 mt-3 space-y-3">
                <Link to="/login" className="block py-2 text-text font-medium hover:text-primary transition-colors" onClick={closeMobile}>
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="block text-center bg-text text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary transition-all"
                  onClick={closeMobile}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
