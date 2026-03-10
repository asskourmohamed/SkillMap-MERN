import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import logo from '../../assets/logoo.png';

const AppHeader = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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
    console.log('🚪 Déconnexion en cours...');
    
    // Nettoyer le localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    console.log('✅ Données nettoyées du localStorage');
    
    // Fermer le dropdown
    setIsDropdownOpen(false);
    
    // Rediriger vers la page d'accueil
    navigate('/');
    
    // Recharger la page pour réinitialiser tous les états
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  // Vérifier si l'utilisateur est admin
  const isAdmin = user?.role === 'admin';

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/app/feed" className="flex items-center">
          <img 
            src={logo} 
            alt="ProConnect Logo" 
            className="h-16 w-auto"
          />
        </Link>
        
        <div className="flex items-center gap-4">
          <Link
            to="/app/discovery"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">search</span>
            <span className="hidden md:inline"></span>
          </Link>
          <Link
            to="/app/feed"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">home</span>
            <span className="hidden md:inline"></span>
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Icône admin - visible seulement pour les admins */}
          {isAdmin && (
            <>
              <Link 
                to="/app/admin/dashboard"
                className="relative group"
                title="Administration"
              >
                <button className="p-2 text-amber-600 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-full transition-colors">
                  <span className="material-symbols-outlined">admin_panel_settings</span>
                </button>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
              </Link>
              
              {/* Badge "Admin" sur l'avatar (optionnel) */}
              <div className="relative">
                <span className="absolute -top-1 -right-1 z-10 w-4 h-4 bg-amber-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                  <span className="text-[10px] text-white font-bold">A</span>
                </span>
              </div>
            </>
          )}
          
          {/* Notifications - accessible à tous */}
          <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {/* Messages - accessible à tous */}
          <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative">
            <span className="material-symbols-outlined">chat_bubble</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
          </button>
          
          {/* Menu déroulant du profil */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 focus:outline-none group"
            >
              <div className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-colors ${
                isAdmin 
                  ? 'border-amber-500 group-hover:border-amber-600' 
                  : 'border-primary/30 group-hover:border-primary'
              }`}>
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
            
            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50">
                {/* En-tête du dropdown avec rôle */}
                <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {user?.email}
                  </p>
                  {isAdmin && (
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                        <span className="material-symbols-outlined text-xs mr-1">admin_panel_settings</span>
                        Administrateur
                      </span>
                    </div>
                  )}
                </div>

                {/* Lien admin dans le dropdown */}
                {isAdmin && (
                  <>
                    <Link 
                      to="/app/admin/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <span className="material-symbols-outlined text-sm mr-2">admin_panel_settings</span>
                      Administration
                    </Link>
                    <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                  </>
                )}
                
                <Link 
                  to="/app/my-profile"
                  className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <span className="material-symbols-outlined text-sm mr-2">person</span>
                  Mon Profil
                </Link>
                
                <Link 
                  to="/app/settings" 
                  className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <span className="material-symbols-outlined text-sm mr-2">settings</span>
                  Paramètres
                </Link>
                
                <hr className="my-1 border-slate-200 dark:border-slate-700" />
                
                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <span className="material-symbols-outlined text-sm mr-2">logout</span>
                  Déconnexion
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