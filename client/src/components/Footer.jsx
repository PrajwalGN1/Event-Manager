import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="text-2xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Smart
              </span>
              Event
            </Link>
            <p className="mt-4 text-slate-400 text-sm leading-relaxed">
              The all-in-one platform for creating, managing, and discovering amazing events. Join thousands of organizers worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-slate-400 hover:text-white transition-colors text-sm">Home</Link></li>
              <li><Link to="/events" className="text-slate-400 hover:text-white transition-colors text-sm">Browse Events</Link></li>
              <li><Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors text-sm">Dashboard</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Account</h3>
            <ul className="space-y-3">
              <li><Link to="/login" className="text-slate-400 hover:text-white transition-colors text-sm">Sign In</Link></li>
              <li><Link to="/register" className="text-slate-400 hover:text-white transition-colors text-sm">Create Account</Link></li>
              <li><Link to="/add-event" className="text-slate-400 hover:text-white transition-colors text-sm">Create Event</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">📧 support@smartevent.com</li>
              <li className="flex items-center gap-2">📞 +1 (555) 123-4567</li>
              <li className="flex items-center gap-2">📍 San Francisco, CA</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} SmartEvent. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="text-slate-500 hover:text-white cursor-pointer transition-colors text-sm">Privacy Policy</span>
            <span className="text-slate-500 hover:text-white cursor-pointer transition-colors text-sm">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
