import React, { useState, useEffect } from 'react';

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Debug: voir ce qui est dans localStorage
    console.log('LocalStorage token:', localStorage.getItem('token'));
    console.log('LocalStorage user:', localStorage.getItem('user'));
    
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('User data parsed:', userData);
      console.log('User role:', userData.role);
      
      setUser(userData);
    } catch (error) {
      console.error('Erreur parsing user:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  // Vérification explicite
  if (!user || user.role !== 'admin') {
    console.log('Accès refusé - utilisateur:', user);
    return (
      <div className="text-center mt-5">
        <h1>Accès refusé</h1>
        <p>Rôle actuel: {user?.role || 'non défini'}</p>
        <p>Vous devez être administrateur pour accéder à cette page.</p>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => window.location.href = '/dashboard'}
        >
          Retour au dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Panel Admin</h1>
      <p>Bienvenue {user.name} (rôle: {user.role})</p>
      {/* Le reste de ton code admin */}
    </div>
  );
};

export default AdminPage;