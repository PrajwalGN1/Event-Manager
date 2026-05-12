import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Route Protection
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load events');
      } finally {
        setLoadingEvents(false);
      }
    };

    if (user && user.role === 'admin') fetchEvents();
  }, [user]);

  // Fetch all bookings (admin endpoint)
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings');
        setBookings(response.data.data || []);
      } catch (err) {
        console.error('Failed to load bookings:', err);
      } finally {
        setLoadingBookings(false);
      }
    };

    if (user && user.role === 'admin') fetchBookings();
  }, [user]);

  // Delete event handler
  const handleDelete = async (eventId) => {
    try {
      await api.delete(`/events/${eventId}`);
      setEvents((prev) => prev.filter((e) => e._id !== eventId));
      setDeleteConfirmId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event');
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-[calc(100vh-64px)] p-6 md:p-12 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black mb-2">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Admin</span> Dashboard
          </h1>
          <p className="text-text-muted text-lg">Manage your events and monitor bookings in one place.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl">📅</div>
              <div>
                <p className="text-sm text-text-muted font-bold uppercase tracking-wider">Total Events</p>
                <p className="text-3xl font-black text-text">{events.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-2xl">🎫</div>
              <div>
                <p className="text-sm text-text-muted font-bold uppercase tracking-wider">Total Bookings</p>
                <p className="text-3xl font-black text-text">{bookings.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-2xl">💰</div>
              <div>
                <p className="text-sm text-text-muted font-bold uppercase tracking-wider">Revenue</p>
                <p className="text-3xl font-black text-text">
                  ${bookings.reduce((sum, b) => sum + (b.event?.price || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Events Management Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-12">
          <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-text">Manage Events</h2>
            <Link
              to="/add-event"
              className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2.5 rounded-xl font-bold hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              + Create Event
            </Link>
          </div>

          {loadingEvents ? (
            <div className="p-8">
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-16 bg-slate-50 rounded-xl animate-pulse"></div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="p-8">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg text-red-700">{error}</div>
            </div>
          ) : events.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-text mb-2">No events created yet</h3>
              <p className="text-text-muted mb-6">Start by creating your first event.</p>
              <Link to="/add-event" className="text-primary font-bold hover:text-secondary transition-colors">
                Create Event →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-bold text-text-muted uppercase tracking-wider">Event</th>
                    <th className="text-left px-6 py-4 text-sm font-bold text-text-muted uppercase tracking-wider hidden md:table-cell">Date</th>
                    <th className="text-left px-6 py-4 text-sm font-bold text-text-muted uppercase tracking-wider hidden sm:table-cell">Price</th>
                    <th className="text-left px-6 py-4 text-sm font-bold text-text-muted uppercase tracking-wider hidden lg:table-cell">Venue</th>
                    <th className="text-right px-6 py-4 text-sm font-bold text-text-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {events.map((event) => (
                    <tr key={event._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-lg flex-shrink-0">
                            🎟️
                          </div>
                          <span className="font-bold text-text line-clamp-1">{event.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-muted hidden md:table-cell">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="font-bold text-primary">${event.price}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-muted hidden lg:table-cell line-clamp-1">
                        {event.venue}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/events/${event._id}`}
                            className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-text px-3 py-2 rounded-lg transition-colors"
                          >
                            View
                          </Link>
                          <Link
                            to={`/edit-event/${event._id}`}
                            className="text-xs font-bold bg-blue-50 hover:bg-blue-100 text-primary px-3 py-2 rounded-lg transition-colors"
                          >
                            Edit
                          </Link>
                          {deleteConfirmId === event._id ? (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleDelete(event._id)}
                                className="text-xs font-bold bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="text-xs font-bold bg-slate-200 text-text px-3 py-2 rounded-lg hover:bg-slate-300 transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(event._id)}
                              className="text-xs font-bold bg-red-50 hover:bg-red-100 text-red-500 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Bookings Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-100">
            <h2 className="text-2xl font-bold text-text">Recent Bookings</h2>
          </div>

          {loadingBookings ? (
            <div className="p-8 space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="h-12 bg-slate-50 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-4">🎫</div>
              <h3 className="text-xl font-bold text-text mb-2">No bookings yet</h3>
              <p className="text-text-muted">Bookings will appear here once users start booking events.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-bold text-text-muted uppercase tracking-wider">User</th>
                    <th className="text-left px-6 py-4 text-sm font-bold text-text-muted uppercase tracking-wider">Event</th>
                    <th className="text-left px-6 py-4 text-sm font-bold text-text-muted uppercase tracking-wider hidden md:table-cell">Booked On</th>
                    <th className="text-left px-6 py-4 text-sm font-bold text-text-muted uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.slice(0, 20).map((booking) => (
                    <tr key={booking._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-text">{booking.user?.name || 'Unknown'}</p>
                          <p className="text-xs text-text-muted">{booking.user?.email || ''}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-text">{booking.event?.title || 'Deleted Event'}</td>
                      <td className="px-6 py-4 text-sm text-text-muted hidden md:table-cell">
                        {new Date(booking.bookingDate || booking.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {booking.status || 'confirmed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
