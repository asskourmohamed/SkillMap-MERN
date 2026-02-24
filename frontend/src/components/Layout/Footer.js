import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logoo.png';
const Footer = () => {
  return (
    <footer className="bg-white dark:bg-background-dark pt-20 pb-10 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center">
              <img 
                src={logo} 
                alt="ProConnect Logo" 
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              The world's leading professional network for ambitious builders and thinkers.
            </p>
            <div className="flex gap-4">
              <a className="text-slate-400 hover:text-primary transition-colors" href="#">
                <span className="material-symbols-outlined">share</span>
              </a>
              <a className="text-slate-400 hover:text-primary transition-colors" href="#">
                <span className="material-symbols-outlined">public</span>
              </a>
              <a className="text-slate-400 hover:text-primary transition-colors" href="#">
                <span className="material-symbols-outlined">forum</span>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/features" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary">Features</Link></li>
              <li><Link to="/solutions" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary">Solutions</Link></li>
              <li><Link to="/integrations" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary">Integrations</Link></li>
              <li><Link to="/pricing" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary">About Us</Link></li>
              <li><Link to="/careers" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary">Careers</Link></li>
              <li><Link to="/blog" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary">Blog</Link></li>
              <li><Link to="/contact" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><Link to="/privacy" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary">Terms of Service</Link></li>
              <li><Link to="/cookies" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary">Cookie Policy</Link></li>
              <li><Link to="/security" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary">Security</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-500">
            © 2026 SkillMap Inc. All rights reserved. Built with precision for professionals.
          </p>
          <div className="flex items-center gap-4">
            <button aria-label="Toggle theme" className="p-2 text-slate-500 hover:text-primary dark:text-slate-400">
              <span className="material-symbols-outlined text-lg">dark_mode</span>
            </button>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-tighter">Status: Systems Operational</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;