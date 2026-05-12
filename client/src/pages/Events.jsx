import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events');
      setEvents(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  // Delete event handler with confirmation
  const handleDelete = async (eventId) => {
    try {
      await api.delete(`/events/${eventId}`);
      setEvents((prev) => prev.filter((e) => e._id !== eventId));
      setDeleteConfirmId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event');
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Upcoming Events
            </h1>
            <p className="text-text-muted text-lg max-w-2xl">
              Discover and book the most exclusive events happening around you.
            </p>
          </div>

          {user && user.role === 'admin' && (
            <Link
              to="/add-event"
              className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all shadow-lg hover:-translate-y-1 active:translate-y-0 flex-shrink-0"
            >
              + Create Event
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 bg-white/50 backdrop-blur-sm rounded-3xl animate-pulse border border-slate-100"></div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
            <h3 className="text-red-800 font-bold text-lg mb-2">Could not load events</h3>
            <p className="text-red-600">{error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 bg-white/50 backdrop-blur-md rounded-3xl border border-slate-200">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-text mb-2">No Events Found</h3>
            <p className="text-text-muted mb-6">Check back later for exciting new events!</p>
            {user && user.role === 'admin' && (
              <Link to="/add-event" className="text-primary font-bold hover:text-secondary transition-colors">
                Create your first event →
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event._id}
                className="group bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden border border-white/20 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2 flex flex-col"
              >
                <div className="relative h-56 overflow-hidden bg-slate-100">
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

                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-text leading-tight group-hover:text-primary transition-colors">
                      {event.title}
                    </h2>
                  </div>

                  <p className="text-text-muted text-sm mb-6 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-3 mb-6 text-sm font-medium text-slate-600">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">📍</span>
                      {event.venue}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🕒</span>
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>

                  <div className="mt-auto space-y-3">
                    <Link
                      to={`/events/${event._id}`}
                      className="block w-full text-center py-3 px-4 bg-slate-100 hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white text-text font-bold rounded-xl transition-all duration-300"
                    >
                      View Details
                    </Link>

                    {/* Admin Edit/Delete controls */}
                    {user && user.role === 'admin' && (
                      <div className="flex gap-2">
                        <Link
                          to={`/edit-event/${event._id}`}
                          className="flex-1 text-center py-2 px-3 bg-blue-50 hover:bg-blue-100 text-primary font-bold text-sm rounded-xl transition-colors"
                        >
                          ✏️ Edit
                        </Link>
                        {deleteConfirmId === event._id ? (
                          <div className="flex-1 flex gap-1">
                            <button
                              onClick={() => handleDelete(event._id)}
                              className="flex-1 py-2 px-2 bg-red-500 text-white font-bold text-sm rounded-xl hover:bg-red-600 transition-colors cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="flex-1 py-2 px-2 bg-slate-200 text-text font-bold text-sm rounded-xl hover:bg-slate-300 transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(event._id)}
                            className="flex-1 py-2 px-3 bg-red-50 hover:bg-red-100 text-red-500 font-bold text-sm rounded-xl transition-colors cursor-pointer"
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
