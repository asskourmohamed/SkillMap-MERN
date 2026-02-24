import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import logo from '../../assets/logoo.png';
const AppHeader = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center">
              <img 
                src={logo} 
                alt="SkillMap Logo" 
                className="h-16 w-auto"
              />
            </Link>

        <div className="flex-1 max-w-2xl relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input 
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary text-sm" 
            placeholder="Search professionals, skills, or projects..." 
            type="text"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <span className="material-symbols-outlined">chat_bubble</span>
          </button>
          
          {/* Menu déroulant du profil */}
          <div className="relative group">
            <button className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 overflow-hidden border border-primary/30">
                <img 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                  src={user?.profilePicture || "https://lh3.googleusercontent.com/aida-public/AB6AXuD050YU9gFVp7RLrMz66Ea84hjGCtiuOA2XBNzDe6Wj_ew6M8Aq8o1D2Dw2GT7IPq1CTc3JSGihS55VOzIXxZreUy4ABv2uD4YV1KySw6ayJ36um8P7G24bRZ8LHFuoeRD67Q1vgqh-Zt1m2wcEjc29nrBILEMXSKDCGOGrwqEwfMhyyrPcrwuMuQDdhrgFsGuALJ1olnyYODNGjCnhhX1VoMub0LEV6dMOri2siuaLrbVsBZJPL6hgVSUv5YCtBwSzlYXfw-HfbRdY"}
                />
              </div>
              <span className="material-symbols-outlined text-sm text-slate-600">expand_more</span>
            </button>
            
            {/* Dropdown menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 hidden group-hover:block hover:block z-50">
              <Link to="/app/my-profile" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                <span className="material-symbols-outlined text-sm mr-2 align-middle">person</span>
                My Profile
              </Link>
              <Link to="/app/settings" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                <span className="material-symbols-outlined text-sm mr-2 align-middle">settings</span>
                Settings
              </Link>
              <hr className="my-1 border-slate-200 dark:border-slate-700" />
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <span className="material-symbols-outlined text-sm mr-2 align-middle">logout</span>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;