import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/10 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      <div className="text-center relative z-10">
        <h1 className="text-[120px] md:text-[180px] font-black leading-none bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-3xl font-bold text-text mb-4 -mt-4">Page Not Found</h2>
        <p className="text-text-muted max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/"
            className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            Go Home
          </Link>
          <Link
            to="/events"
            className="bg-white text-text border border-slate-200 px-8 py-3 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition-all"
          >
            Browse Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
