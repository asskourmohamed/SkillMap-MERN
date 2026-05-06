import React, { useState, useEffect } from 'react';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import StatsCards from '../components/Dashboard/StatsCards';
import ActiveMentorships from '../components/Dashboard/ActiveMentorships';
import SkillTrends from '../components/Dashboard/SkillTrends';
import { authAPI, mentorshipAPI, skillAPI } from '../services/api';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [mentorships, setMentorships] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // 🔴 Récupérer l'utilisateur depuis localStorage 
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('Utilisateur depuis localStorage:', storedUser);
      console.log('Rôle utilisateur:', storedUser.role);
      
      setUser(storedUser);

      const [mentorshipsData, skillsData] = await Promise.all([
        mentorshipAPI.getMyMentorships().catch(() => []),
        skillAPI.getAll().catch(() => [])
      ]);

      setMentorships(mentorshipsData);
      setSkills(skillsData);
      
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  console.log('Passage à Header/Sidebar - user:', user);

  const stats = {
    hoursMentored: user?.stats?.hoursMentored || 0,
    skillsCount: skills.length,
    activeMentorships: mentorships.filter(m => m.status === 'active').length,
    rank: user?.stats?.rank || 'Débutant',
  };

  return (
    <div className="dashboard-container">
      <Sidebar user={user} onLogout={handleLogout} />
      
      <div className="main-content">
        <Header user={user} onLogout={handleLogout} />
        
        <div className="container-fluid mt-4">
          <div className="mb-4">
            <h1 className="h3">
              Bonjour, {user?.name} 
              {user?.role === 'admin' && (
                <span className="badge bg-danger ms-2">Administrateur</span>
              )}
            </h1>
          </div>

          <StatsCards stats={stats} onCardClick={handleCardClick}/>
          
          {/* Le reste du dashboard */}
        </div>
      </div>
    </div>
  );
};

const handleCardClick = (cardId) => {
  switch(cardId) {
    case 'users':
      setActiveTab('users');
      break;
    case 'skills':
      setActiveTab('skills');
      break;
    case 'mentorships':
      console.log('Voir les mentorats');
      break;
    case 'engagement':
      console.log('Voir les statistiques détaillées');
      break;
    default:
      break;
  }
};

const handleSkillClick = (skill) => {
  console.log('Détails de la compétence:', skill);
  alert(`Compétence: ${skill.skill}\nDemande: ${skill.demand}\nOffre: ${skill.supply}`);
};
export default DashboardPage;