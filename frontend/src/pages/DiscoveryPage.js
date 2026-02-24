import React, { useState, useEffect } from 'react';
import AppHeader from '../components/Layout/AppHeader';
import { Link } from 'react-router-dom';
import { employeeService } from '../services/api';

const DiscoveryPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [filter, setFilter] = useState('All Suggested');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Récupérer l'utilisateur connecté
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await employeeService.getAll();
      setProfiles(response.data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const filters = ['All Suggested', 'Développement', 'Design', 'Marketing', 'Data', 'DevOps'];

  const filteredProfiles = profiles.filter(profile => {
    if (filter !== 'All Suggested' && profile.department !== filter) return false;
    if (searchTerm) {
      return profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             profile.skills?.some(skill => skill.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
             profile.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <AppHeader user={user} />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <AppHeader user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barre de recherche */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, skill, or title..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>
        </div>

        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Discovery</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Expand your professional network with people you may know.</p>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${
                  filter === f
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProfiles.map((profile) => (
            <div key={profile._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/40"></div>
              
              <div className="px-6 pb-6 -mt-12 flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-full border-4 border-white dark:border-slate-900 overflow-hidden bg-slate-100 mb-4">
                  <img 
                    alt={profile.name} 
                    className="h-full w-full object-cover" 
                    src={profile.profilePicture || "https://lh3.googleusercontent.com/aida-public/AB6AXuAkcJ9S1t6zQT3VXRgVMnPQafFpw_l8XVu0X0G126Mj0kdMOZ1U1aMsFuwAbYrv2FrKIXb86TfM0AquMVODyzplsDAL5McyDz4ryNNAVZGNSA5qnA6q22-dLFH-JG-MNhZaZ5STNPWORyW44JrBYjs73yKyQ_wFAmH0-j-chNFH9999S1hSshu2LP7_7lbdfzYrXzWuPMrLwutfNi8O7lSIVBg3AqnxWSLhXIqK0UkkZvlPdt1h347fVethNPoLrA5DFSngG7vXEWEW"}
                  />
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{profile.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {profile.jobTitle || 'Professional'} {profile.company ? `at ${profile.company}` : ''}
                </p>
                
                <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  {profile.location || 'Remote'}
                </div>

                {/* Skills preview */}
                {profile.skills && profile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3 justify-center">
                    {profile.skills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-xs rounded-full">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                )}
                
                <Link 
                  to={`/app/profile/${profile._id}`} 
                  className="mt-4 w-full py-2.5 px-4 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 active:transform active:scale-95 transition-all"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredProfiles.length === 0 && (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-slate-300">person_search</span>
            <p className="text-slate-500 mt-4">No professionals found matching your criteria</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default DiscoveryPage;