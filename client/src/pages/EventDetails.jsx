import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingStatus, setBookingStatus] = useState({ loading: false, success: false, error: null });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleBookEvent = async () => {
    if (!user) {
      // Redirect to login, but remember where they wanted to go!
      navigate('/login', { state: { from: { pathname: `/events/${id}` } } });
      return;
    }

    setBookingStatus({ loading: true, success: false, error: null });
    try {
      await api.post('/bookings', { eventId: id });
      setBookingStatus({ loading: false, success: true, error: null });
    } catch (err) {
      setBookingStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || 'Failed to book event',
      });
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await api.delete(`/events/${id}`);
      navigate('/events');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-96 bg-slate-200 rounded-3xl w-full"></div>
          <div className="h-12 bg-slate-200 rounded-xl w-1/3"></div>
          <div className="space-y-4">
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            <div className="h-4 bg-slate-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 md:p-12 flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-8 rounded-r-2xl max-w-lg w-full shadow-lg">
          <h2 className="text-red-800 font-bold text-2xl mb-4">Error Loading Event</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Link to="/events" className="text-red-700 font-semibold hover:underline">
            &larr; Back to all events
          </Link>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 relative overflow-hidden">
      {/* Dynamic Header Background based on Event Image */}
      <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden z-0">
        <div className="absolute inset-0 bg-slate-900/60 z-10"></div>
        {event.image && event.image !== 'no-photo.jpg' ? (
          <img src={event.image} alt="Background blur" className="w-full h-full object-cover filter blur-2xl transform scale-110" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary to-secondary"></div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-12 pb-24">
        <div className="flex items-center justify-between mb-8">
          <Link to="/events" className="inline-flex items-center text-white/80 hover:text-white font-medium transition-colors">
            &larr; Back to Events
          </Link>

          {/* Admin Actions in header area */}
          {user && user.role === 'admin' && (
            <div className="flex gap-3">
              <Link
                to={`/edit-event/${event._id}`}
                className="bg-white/20 backdrop-blur-md text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-white/30 transition-all border border-white/20"
              >
                ✏️ Edit Event
              </Link>
              {showDeleteConfirm ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleDeleteEvent}
                    className="bg-red-500 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-red-600 transition-all cursor-pointer"
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="bg-white/20 backdrop-blur-md text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-white/30 transition-all border border-white/20 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-500/80 backdrop-blur-md text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-red-500 transition-all cursor-pointer"
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          )}
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Left Column: Image */}
            <div className="relative h-64 lg:h-full min-h-[400px] bg-slate-100">
              {event.image && event.image !== 'no-photo.jpg' ? (
                <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                  <span className="text-8xl opacity-50">🎟️</span>
                </div>
              )}
            </div>

            {/* Right Column: Details & Booking */}
            <div className="p-8 md:p-12 flex flex-col">
              <div className="mb-2 inline-block">
                <span className="px-3 py-1 bg-primary/10 text-primary font-bold text-sm rounded-full tracking-wide">
                  UPCOMING EVENT
                </span>
              </div>

              <h1 className="text-4xl font-black text-text leading-tight mb-4">
                {event.title}
              </h1>

              <div className="flex flex-wrap gap-4 mb-8 text-sm font-semibold text-slate-600">
                <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg">
                  <span className="text-lg">📅</span>
                  {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg">
                  <span className="text-lg">📍</span>
                  {event.venue}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-text mb-2">About this event</h3>
                <p className="text-text-muted leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              <div className="mt-auto pt-8 border-t border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-text-muted font-medium mb-1">Total Price</p>
                    <p className="text-4xl font-black text-text">
                      {event.price === 0 ? 'FREE' : `$${event.price}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-text-muted font-medium mb-1">Availability</p>
                    <p className="text-green-500 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span> Tickets Available
                    </p>
                  </div>
                </div>

                {/* Status Messages */}
                {bookingStatus.error && (
                  <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-xl text-sm font-bold border border-red-200">
                    ⚠️ {bookingStatus.error}
                  </div>
                )}
                {bookingStatus.success && (
                  <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-xl text-sm font-bold border border-green-200 flex items-center gap-2">
                    ✅ Ticket booked successfully! Check your dashboard.
                  </div>
                )}

                {/* Booking Button */}
                <button
                  onClick={handleBookEvent}
                  disabled={bookingStatus.loading || bookingStatus.success}
                  className={`w-full py-4 px-6 rounded-xl font-black text-lg shadow-xl transform transition-all duration-200 cursor-pointer
                    ${bookingStatus.success
                      ? 'bg-green-500 text-white cursor-not-allowed shadow-green-500/30'
                      : 'bg-gradient-to-r from-primary to-secondary hover:from-blue-600 hover:to-violet-600 text-white hover:-translate-y-1 shadow-primary/30 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none'
                    }`}
                >
                  {bookingStatus.loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : bookingStatus.success ? (
                    'Ticket Secured ✓'
                  ) : user ? (
                    'Book Ticket Now'
                  ) : (
                    'Log in to Book Ticket'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
