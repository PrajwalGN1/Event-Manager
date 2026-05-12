import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    price: '',
    image: '',
  });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Route Protection: Kick out non-admins
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'admin') {
      navigate('/events');
    }
  }, [user, navigate]);

  // Fetch existing event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        const event = response.data.data;
        setFormData({
          title: event.title || '',
          description: event.description || '',
          date: event.date ? event.date.substring(0, 10) : '',
          venue: event.venue || '',
          price: event.price !== undefined ? String(event.price) : '',
          image: event.image === 'no-photo.jpg' ? '' : event.image || '',
        });
      } catch (err) {
        setErrorMsg(err.response?.data?.message || 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'admin') {
      fetchEvent();
    }
  }, [id, user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await api.put(`/events/${id}`, {
        ...formData,
        price: Number(formData.price),
      });
      navigate('/events');
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Failed to update event');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== 'admin') return null;

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-muted font-medium">Loading event data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full filter blur-3xl opacity-30 pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Breadcrumb */}
        <Link to="/events" className="inline-flex items-center text-text-muted hover:text-primary font-medium mb-6 transition-colors">
          ← Back to Events
        </Link>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
          <div className="p-8 md:p-12">
            <div className="mb-8 border-b border-slate-100 pb-6">
              <h2 className="text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Edit Event
              </h2>
              <p className="text-text-muted mt-2">Update the event details below.</p>
            </div>

            {errorMsg && (
              <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-700">
                <p className="font-medium">{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-text mb-2" htmlFor="title">
                  Event Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  placeholder="e.g. Summer Music Festival 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-text mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  required
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                  placeholder="Describe the event details..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-text mb-2" htmlFor="date">
                    Event Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-2" htmlFor="venue">
                    Venue Location
                  </label>
                  <input
                    type="text"
                    name="venue"
                    id="venue"
                    required
                    value={formData.venue}
                    onChange={handleChange}
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    placeholder="e.g. Madison Square Garden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-text mb-2" htmlFor="price">
                    Ticket Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    min="0"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-2" htmlFor="image">
                    Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="image"
                    id="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-4 px-4 bg-gradient-to-r from-primary to-secondary hover:from-blue-600 hover:to-violet-600 text-white rounded-xl font-bold shadow-lg transform transition-all duration-200 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? 'Updating Event...' : 'Update Event'}
                </button>
                <Link
                  to="/events"
                  className="py-4 px-8 bg-slate-100 text-text rounded-xl font-bold hover:bg-slate-200 transition-all text-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
