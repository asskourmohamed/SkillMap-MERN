import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, BookOpen, Settings, Bell, LogOut } from 'lucide-react';
import adminApi from '../../services/adminAPI';
import StatsCards from '../../components/Admin/StatsCards';
import UsersTable from '../../components/Admin/UsersTable';
import SkillGapsChart from '../../components/Admin/SkillGapsTable';
import { authService } from '../../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [skillGaps, setSkillGaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      navigate('/app/feed');
      return;
    }
    setCurrentUser(user);
    fetchAdminData();
  }, [navigate]);

  const getTopSkills = (skills) => {
    if (!skills || !Array.isArray(skills)) {
      return [];
    }
    
    const skillCount = {};
    skills.forEach(skill => {
      const name = skill.title || skill.name;
      if (name) {
        skillCount[name] = (skillCount[name] || 0) + 1;
      }
    });
    
    return Object.entries(skillCount)
      .map(([name, count]) => ({ _id: name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const fetchAdminData = async () => {
  try {
    setLoading(true);

    const [dashboardRes, usersRes, skillsRes] = await Promise.all([
      adminApi.getDashboardStats(),
      adminApi.getUsers(),
      adminApi.getSkills(),
    ]);

    const dashboardData = dashboardRes.data?.data;
    const usersList = Array.isArray(usersRes.data?.data)
      ? usersRes.data.data
      : usersRes.data?.data?.users || [];

    // Skills response: { success, data: [...] }
    const skillsList = Array.isArray(skillsRes.data?.data)
      ? skillsRes.data.data
      : [];

    // Use dashboard stats directly — they're already correct
    setStats({
      stats: dashboardData?.stats,
      recentUsers: dashboardData?.recentUsers || [],
    });

    setUsers(usersList);
    setSkillGaps(skillsList);

  } catch (error) {
    console.error('Erreur chargement données admin:', error);
    console.error('Détails:', error.response?.data);
  } finally {
    setLoading(false);
  }
};

  const handleEditUser = (user) => {
    console.log('Éditer utilisateur:', user);
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Voulez-vous vraiment supprimer ${user.name} ?`)) {
      try {
        await adminApi.deleteUser(user._id);
        await fetchAdminData();
      } catch (error) {
        console.error('Erreur suppression:', error);
      }
    }
  };

  const handleRoleChange = (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (window.confirm(`Changer le rôle de ${user.name} en ${newRole} ?`)) {
      console.log('Changer rôle:', user._id, newRole);
    }
  };

  const handleSearch = async (searchTerm) => {
    try {
      const data = await adminApi.getUsers(1, searchTerm);
      const usersList = data.data?.users || data.data || [];
      setUsers(usersList);
    } catch (error) {
      console.error('Erreur recherche:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-primary">SkillShare</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Administration</p>
        </div>
        
        <nav className="mt-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-primary/10 text-primary border-r-4 border-primary'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
              activeTab === 'users'
                ? 'bg-primary/10 text-primary border-r-4 border-primary'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Utilisateurs</span>
          </button>
          
          <button
            onClick={() => setActiveTab('skills')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
              activeTab === 'skills'
                ? 'bg-primary/10 text-primary border-r-4 border-primary'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>Compétences</span>
          </button>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold">
              {currentUser?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="font-medium text-sm">{currentUser?.name}</p>
              <p className="text-xs text-slate-500">Administrateur</p>
            </div>
          </div>
          
          <button 
            onClick={() => {
              authService.logout();
              navigate('/');
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {activeTab === 'dashboard' && 'Tableau de bord'}
              {activeTab === 'users' && 'Gestion des utilisateurs'}
              {activeTab === 'skills' && 'Gestion des compétences'}
            </h1>
            
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'dashboard' && stats && (
            <div className="space-y-6">
              <StatsCards stats={stats} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SkillGapsChart skillGaps={skillGaps} />
                
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                    Dernières inscriptions
                  </h3>
                  <div className="space-y-4">
                    {stats.recentUsers?.length > 0 ? (
                      stats.recentUsers.map((user, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-sm font-medium">{user.name?.charAt(0)}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                          <span className="text-xs text-slate-400">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-slate-500 py-8">Aucun utilisateur</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                  Compétences les plus partagées
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {stats.stats?.skills?.topSkills?.length > 0 ? (
                    stats.stats.skills.topSkills.map((skill, index) => (
                      <div key={index} className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <p className="font-medium">{skill._id}</p>
                        <p className="text-sm text-slate-500">{skill.count} utilisateurs</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-slate-500 col-span-5 py-4">Aucune compétence</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <UsersTable
              users={users}
              loading={loading}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              onRoleChange={handleRoleChange}
              onSearch={handleSearch}
            />
          )}

          {activeTab === 'skills' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                Gestion des compétences
              </h3>
              <div className="space-y-4">
                {skillGaps.length > 0 ? (
                  skillGaps.map((skill, index) => (
                    <div key={index} className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium">{skill.title}</span>
                        <span className="text-sm text-primary">{skill.level}</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
                        {skill.owner?.name} • {skill.owner?.department}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-500 py-8">Aucune compétence trouvée</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;