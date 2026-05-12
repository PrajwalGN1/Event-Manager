import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Fetch first 3 events for the "Popular Events" section
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.get('/events');
        setFeaturedEvents((response.data.data || []).slice(0, 3));
      } catch {
        // Silently fail — hero section is not dependent on this
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="flex-1">
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-violet-950"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-secondary/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full mb-8 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-white/80 text-sm font-medium">Live Events Available Now</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-tight">
              Manage your events
              <br />
              with{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                SmartEvent
              </span>
            </h1>

            <p className="text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed">
              The all-in-one platform for creating, managing, and discovering amazing events.
              Join our community today and experience the future of event management.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {/* ✅ WORKING "Get Started" button — navigates to /register */}
              <Link
                to="/register"
                id="hero-get-started"
                className="bg-gradient-to-r from-primary to-secondary text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all hover:-translate-y-1 active:translate-y-0"
              >
                Get Started — It's Free
              </Link>

              {/* ✅ WORKING "Browse Events" button — navigates to /events */}
              <Link
                to="/events"
                id="hero-browse-events"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all hover:-translate-y-1"
              >
                Browse Events →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FEATURES SECTION ===================== */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full filter blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-primary font-bold text-sm uppercase tracking-widest">Why Choose Us</span>
            <h2 className="text-4xl md:text-5xl font-black text-text mt-3 mb-4">
              Everything you need to manage events
            </h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              From discovery to booking, we've got every step covered with premium tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎯',
                title: 'Discover Events',
                description: 'Browse through hundreds of curated events happening in your city. Find concerts, workshops, conferences and more.',
              },
              {
                icon: '🎟️',
                title: 'Instant Booking',
                description: 'Book tickets in seconds with our lightning-fast checkout. Get instant confirmation and digital tickets.',
              },
              {
                icon: '📊',
                title: 'Manage & Track',
                description: 'Organizers get a powerful dashboard to create events, track bookings, and analyze performance in real-time.',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-lg shadow-slate-100/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-text mb-3">{feature.title}</h3>
                <p className="text-text-muted leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== POPULAR EVENTS SECTION ===================== */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
            <div>
              <span className="text-secondary font-bold text-sm uppercase tracking-widest">Featured</span>
              <h2 className="text-4xl md:text-5xl font-black text-text mt-3 mb-4">Popular Events</h2>
              <p className="text-text-muted text-lg max-w-xl">Don't miss out on the hottest events this season.</p>
            </div>
            <Link
              to="/events"
              className="mt-6 md:mt-0 text-primary font-bold hover:text-secondary transition-colors"
            >
              View all events →
            </Link>
          </div>

          {loadingEvents ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-80 bg-white rounded-3xl animate-pulse border border-slate-100"></div>
              ))}
            </div>
          ) : featuredEvents.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-text mb-2">No events yet</h3>
              <p className="text-text-muted mb-6">Be the first to create an amazing event!</p>
              <Link to="/add-event" className="text-primary font-bold hover:text-secondary transition-colors">
                Create Event →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredEvents.map((event) => (
                <div
                  key={event._id}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-lg shadow-slate-100/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    {event.image && event.image !== 'no-photo.jpg' ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                        <span className="text-6xl opacity-50">🎟️</span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-black text-primary shadow-sm">
                      {event.price === 0 ? 'FREE' : `$${event.price}`}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-text mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <div className="space-y-2 text-sm text-text-muted mb-4">
                      <p className="flex items-center gap-2">📍 {event.venue}</p>
                      <p className="flex items-center gap-2">
                        📅{' '}
                        {new Date(event.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <Link
                      to={`/events/${event._id}`}
                      className="block w-full text-center py-3 bg-slate-100 hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white text-text font-bold rounded-xl transition-all duration-300"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===================== STATISTICS SECTION ===================== */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-950 to-violet-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Trusted by Thousands</h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Our platform powers events worldwide. Here's a snapshot of our impact.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10K+', label: 'Events Hosted' },
              { value: '50K+', label: 'Tickets Sold' },
              { value: '2K+', label: 'Organizers' },
              { value: '99%', label: 'Satisfaction' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </p>
                <p className="text-white/60 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA SECTION ===================== */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-text mb-6">
            Ready to host your event?
          </h2>
          <p className="text-text-muted text-lg mb-10 max-w-xl mx-auto">
            Join SmartEvent as an organizer and reach thousands of attendees. Setting up takes less than 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="bg-gradient-to-r from-primary to-secondary text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 hover:shadow-2xl transition-all hover:-translate-y-1"
            >
              Start Organizing
            </Link>
            <Link
              to="/events"
              className="bg-slate-100 text-text px-10 py-4 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
