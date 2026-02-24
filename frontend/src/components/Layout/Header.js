import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logoo.png';
const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center">
              <img 
                src={logo} 
                alt="ProConnect Logo" 
                className="h-16 w-auto"
              />
            </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Features</Link>
            <Link to="/about" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">About</Link>
            <Link to="/pricing" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Pricing</Link>
          </nav>
          
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
              Login
            </Link>
            <Link to="/signup" className="px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-all">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;