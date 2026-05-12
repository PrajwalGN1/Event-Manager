import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMyBookings = async () => {
      try {
        const response = await api.get('/bookings/user');
        setBookings(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load your tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-64px)] p-6 md:p-12 relative overflow-hidden bg-slate-50">
      <div className="max-w-6xl mx-auto relative z-10">

        {/* Dashboard Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 mb-10 flex flex-col md:flex-row items-center justify-between border border-slate-200">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-text mb-2">
              Welcome back, <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{user.name.split(' ')[0]}</span>!
            </h1>
            <p className="text-text-muted font-medium">Manage your event tickets and upcoming experiences.</p>
          </div>
          <div className="mt-6 md:mt-0 flex items-center gap-4">
            <div className="bg-slate-100 px-6 py-4 rounded-2xl border border-slate-200">
              <p className="text-sm text-text-muted font-bold uppercase tracking-wider mb-1">Total Tickets</p>
              <p className="text-4xl font-black text-primary">{bookings.length}</p>
            </div>
            {user.role === 'admin' && (
              <Link
                to="/admin-dashboard"
                className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-4 rounded-2xl font-bold hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                Admin Panel →
              </Link>
            )}
          </div>
        </div>

        {/* Bookings Section */}
        <h2 className="text-2xl font-bold text-text mb-6">Your Upcoming Events</h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((n) => (
              <div key={n} className="h-48 bg-white/50 rounded-3xl animate-pulse border border-slate-200"></div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 p-6 rounded-2xl text-red-700 font-medium">
            ⚠️ {error}
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200 p-12 text-center shadow-lg">
            <div className="text-6xl mb-6">🎫</div>
            <h3 className="text-2xl font-bold text-text mb-3">No tickets yet!</h3>
            <p className="text-text-muted mb-8 max-w-md mx-auto">
              Your dashboard looks a little empty. Browse our catalog and book your first unforgettable experience.
            </p>
            <Link
              to="/events"
              className="inline-block bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all hover:-translate-y-1"
            >
              Explore Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {bookings.map((booking) => {
              const event = booking.event;
              // If event was deleted by admin after booking, gracefully handle null event
              if (!event) return (
                <div key={booking._id} className="bg-slate-100 rounded-3xl p-6 border border-slate-200 opacity-50">
                  <p className="text-red-500 font-bold">This event has been cancelled and removed by the organizer.</p>
                </div>
              );

              return (
                <div key={booking._id} className="flex flex-col sm:flex-row bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 hover:shadow-2xl transition-shadow group">
                  {/* Event Image */}
                  <div className="sm:w-2/5 h-48 sm:h-auto relative bg-slate-100">
                    {event.image && event.image !== 'no-photo.jpg' ? (
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                        <span className="text-5xl opacity-50">🎟️</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-black text-secondary shadow-sm">
                      BOOKED
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="p-6 sm:w-3/5 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-text mb-2 line-clamp-2">{event.title}</h3>
                      <div className="text-sm font-medium text-text-muted space-y-1 mb-4">
                        <p className="flex items-center gap-2">
                          <span>📅</span> {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className="flex items-center gap-2 line-clamp-1">
                          <span>📍</span> {event.venue}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                      <span className="text-primary font-black">Paid: ${event.price}</span>
                      <Link
                        to={`/events/${event._id}`}
                        className="text-sm font-bold text-text hover:text-secondary transition-colors"
                      >
                        View Event &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
