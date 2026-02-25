import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import logo from '../../assets/logoo.png';

const AppHeader = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

const handleLogout = () => {
  // Nettoyer le localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Rediriger vers la page d'accueil
  navigate('/');
};

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
            <Link to="/app/discovery" className="flex items-center">
              <img 
                src={logo} 
                alt="ProConnect Logo" 
                className="h-16 w-auto"
              />
            </Link>


        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <span className="material-symbols-outlined">chat_bubble</span>
          </button>
          
          {/* Menu déroulant du profil - Version corrigée */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 overflow-hidden border border-primary/30">
                <img 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                  src={user?.profilePicture || "https://lh3.googleusercontent.com/aida-public/AB6AXuD050YU9gFVp7RLrMz66Ea84hjGCtiuOA2XBNzDe6Wj_ew6M8Aq8o1D2Dw2GT7IPq1CTc3JSGihS55VOzIXxZreUy4ABv2uD4YV1KySw6ayJ36um8P7G24bRZ8LHFuoeRD67Q1vgqh-Zt1m2wcEjc29nrBILEMXSKDCGOGrwqEwfMhyyrPcrwuMuQDdhrgFsGuALJ1olnyYODNGjCnhhX1VoMub0LEV6dMOri2siuaLrbVsBZJPL6hgVSUv5YCtBwSzlYXfw-HfbRdY"}
                />
              </div>
              <span className="material-symbols-outlined text-sm text-slate-600">
                {isDropdownOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>
            
            {/* Dropdown menu - visible quand isDropdownOpen est true */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50">
                <Link 
                  to="/app/my-profile" 
                  className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <span className="material-symbols-outlined text-sm mr-2 align-middle">person</span>
                  My Profile
                </Link>
                <Link 
                  to="/app/settings" 
                  className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <span className="material-symbols-outlined text-sm mr-2 align-middle">settings</span>
                  Settings
                </Link>
                <hr className="my-1 border-slate-200 dark:border-slate-700" />
                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <span className="material-symbols-outlined text-sm mr-2 align-middle">logout</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;