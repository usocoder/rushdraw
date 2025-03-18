
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="py-6 border-b border-slate-800">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-8 h-8 text-blue-500"
          >
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
            <circle cx="7.5" cy="11.5" r="1.5" />
            <circle cx="12" cy="11.5" r="1.5" />
            <circle cx="16.5" cy="11.5" r="1.5" />
          </svg>
          <span className="text-xl font-bold gradient-text">AI Bot Platform</span>
        </Link>

        <nav className="hidden md:flex space-x-8">
          <Link to="/" className="text-slate-300 hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/features" className="text-slate-300 hover:text-white transition-colors">
            Features
          </Link>
          <Link to="/pricing" className="text-slate-300 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors">
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
