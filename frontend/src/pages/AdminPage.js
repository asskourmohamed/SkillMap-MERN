import React, { useState, useEffect } from 'react';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import UserTable from '../components/Admin/UserTable';
import UserModal from '../components/Admin/UserModal';
import AnalyticsDashboard from '../components/Admin/AnalyticsDashboard';
import { adminAPI } from '../services/api';

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData] = await Promise.all([
        adminAPI.getStats()
      ]);
      setStats(statsData);
      fetchUsers();
    } catch (error) {
      console.error('Erreur chargement admin:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (page = 1, search = '', role = 'all') => {
    try {
      const response = await adminAPI.getUsers({ page, search, role });
      setUsers(response.users);
      setPagination({
        page: response.currentPage,
        totalPages: response.totalPages,
        total: response.total
      });
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await adminAPI.deleteUser(userId);
        fetchUsers(pagination.page);
        alert('Utilisateur supprimé avec succès');
      } catch (error) {
        console.error('Erreur suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      if (selectedUser) {
        await adminAPI.updateUser(selectedUser._id, userData);
        alert('Utilisateur mis à jour avec succès');
      } else {
        await adminAPI.createUser(userData);
        alert('Utilisateur créé avec succès');
      }
      fetchUsers(pagination.page);
      setShowUserModal(false);
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert(error.error || 'Erreur lors de la sauvegarde');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center mt-5">
        <h1>Accès refusé</h1>
        <p>Vous devez être administrateur pour accéder à cette page.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar user={user} onLogout={handleLogout} />
      
      <div className="main-content">
        <Header user={user} onLogout={handleLogout} />
        
        <div className="container-fluid mt-4">
          <div className="mb-4">
            <h1 className="h2">Administration</h1>
            <p className="text-muted">
              Gérez les utilisateurs et consultez les statistiques de la plateforme
            </p>
          </div>

          {/* Onglets admin */}
          <nav className="nav nav-tabs mb-4">
            <button 
              className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <i className="fas fa-chart-line me-2"></i>
              Tableau de bord
            </button>
            <button 
              className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <i className="fas fa-users me-2"></i>
              Utilisateurs
            </button>
            <button 
              className={`nav-link ${activeTab === 'skills' ? 'active' : ''}`}
              onClick={() => setActiveTab('skills')}
            >
              <i className="fas fa-graduation-cap me-2"></i>
              Compétences
            </button>
            <button 
              className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              <i className="fas fa-calculator me-2"></i>
              Statistiques détaillées
            </button>
          </nav>

          {/* Contenu des onglets */}
          {activeTab === 'dashboard' && (
            <AnalyticsDashboard stats={stats} />
          )}

          {activeTab === 'users' && (
            <UserTable 
              users={users}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              onCreate={handleCreateUser}
            />
          )}

          {activeTab === 'skills' && (
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">Gestion des compétences</h6>
              </div>
              <div className="card-body">
                <p>Gestion des compétences - En développement</p>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">Statistiques globales</h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-6 mb-3">
                        <div className="display-6 fw-bold text-primary">
                          {stats?.overview?.totalUsers || 0}
                        </div>
                        <small className="text-muted">Utilisateurs</small>
                      </div>
                      <div className="col-6 mb-3">
                        <div className="display-6 fw-bold text-success">
                          {stats?.overview?.totalSkills || 0}
                        </div>
                        <small className="text-muted">Compétences</small>
                      </div>
                      <div className="col-6 mb-3">
                        <div className="display-6 fw-bold text-info">
                          {stats?.overview?.activeMentorships || 0}
                        </div>
                        <small className="text-muted">Mentorats actifs</small>
                      </div>
                      <div className="col-6 mb-3">
                        <div className="display-6 fw-bold text-warning">
                          {stats?.overview?.engagementRate || 0}%
                        </div>
                        <small className="text-muted">Taux d'engagement</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">Croissance</h6>
                  </div>
                  <div className="card-body">
                    <div className="display-6 fw-bold text-success mb-2">
                      +{stats?.overview?.growthRate || 0}%
                    </div>
                    <small className="text-muted">Nouveaux utilisateurs ce mois</small>
                    
                    <div className="mt-4">
                      <h6>Top mentors</h6>
                      {stats?.topMentors?.map((mentor, idx) => (
                        <div key={idx} className="d-flex justify-content-between align-items-center mt-2">
                          <span>{mentor.name}</span>
                          <span className="badge bg-primary">
                            {mentor.sessions} sessions
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal utilisateur */}
      {showUserModal && (
        <UserModal 
          user={selectedUser}
          onClose={() => setShowUserModal(false)}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
};

export default AdminPage;