import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState('user'); // 'user' or 'admin'
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    // Pass the selected role to the register function
    const result = await register(name, email, password, accountType);
    if (!result.success) {
      setErrorMsg(result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md relative z-10 my-8">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 transition-all duration-300 hover:shadow-secondary/10">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-2">
                Join Us
              </h2>
              <p className="text-text-muted">Create an account to get started</p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-700 animate-pulse">
                <p className="text-sm font-medium">{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-text mb-1.5" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl bg-white/50 border border-slate-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-200 outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text mb-1.5" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl bg-white/50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
                  placeholder="john@example.com"
                />
              </div>

              {/* Account Type Selector */}
              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAccountType('user')}
                    className={`py-3 px-4 rounded-xl font-semibold text-sm border-2 transition-all duration-200 cursor-pointer ${
                      accountType === 'user'
                        ? 'border-primary bg-primary/10 text-primary shadow-sm'
                        : 'border-slate-200 bg-white text-text-muted hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xl mb-1">👤</div>
                    Attendee
                    <p className="text-xs mt-0.5 opacity-70">Browse & book events</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('admin')}
                    className={`py-3 px-4 rounded-xl font-semibold text-sm border-2 transition-all duration-200 cursor-pointer ${
                      accountType === 'admin'
                        ? 'border-secondary bg-secondary/10 text-secondary shadow-sm'
                        : 'border-slate-200 bg-white text-text-muted hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xl mb-1">🎯</div>
                    Organizer
                    <p className="text-xs mt-0.5 opacity-70">Create & manage events</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text mb-1.5" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength="6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl bg-white/50 border border-slate-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-200 outline-none"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text mb-1.5" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  minLength="6"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl bg-white/50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 mt-2 bg-gradient-to-r from-secondary to-primary hover:from-violet-600 hover:to-blue-600 text-white rounded-xl font-bold shadow-lg shadow-secondary/30 transform transition-all duration-200 hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  `Create ${accountType === 'admin' ? 'Organizer' : 'Attendee'} Account`
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-text-muted">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-secondary hover:text-primary transition-colors duration-200">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
