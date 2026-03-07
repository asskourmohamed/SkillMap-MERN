import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaUser, 
  FaSearch, 
  FaHandshake, 
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaShieldAlt 
} from 'react-icons/fa';

const Sidebar = ({ user, onLogout }) => {
  console.log('Sidebar reçoit user:', user);
  console.log('Rôle dans Sidebar:', user?.role);

  const menuItems = [
    { path: '/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { path: '/profile', icon: <FaUser />, label: 'Mon profil' },
    { path: '/find-mentors', icon: <FaSearch />, label: 'Trouver des mentors' },
    { path: '/my-mentorships', icon: <FaHandshake />, label: 'Mes mentorats' },
  ];

  // 🔴 AJOUT DYNAMIQUE DU MENU ADMIN
  const adminItems = user?.role === 'admin' ? [
    { path: '/admin', icon: <FaShieldAlt />, label: 'Administration' },
  ] : [];

  const allMenuItems = [...menuItems, ...adminItems];

  return (
    <div className="sidebar bg-dark text-white vh-100" style={{ width: '250px' }}>
      <div className="sidebar-header p-3 border-bottom">
        <h4 className="mb-0">SkillShare</h4>
        <small className="text-muted">Plateforme de mentorat</small>
      </div>

      <div className="sidebar-menu p-3">
        <h6 className="text-uppercase text-muted mb-3">Navigation</h6>
        <ul className="nav flex-column">
          {allMenuItems.map((item) => (
            <li className="nav-item mb-2" key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => 
                  `nav-link d-flex align-items-center text-white ${isActive ? 'active bg-primary' : ''}`
                }
              >
                <span className="me-3">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mt-5 pt-4 border-top">
          <div className="nav-item">
            <NavLink to="/settings" className="nav-link d-flex align-items-center text-white">
              <FaCog className="me-3" />
              Paramètres
            </NavLink>
          </div>
          <div className="nav-item">
            <button 
              className="nav-link d-flex align-items-center w-100 text-start border-0 bg-transparent text-white"
              onClick={onLogout}
            >
              <FaSignOutAlt className="me-3" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Section utilisateur */}
      <div className="sidebar-footer p-3 border-top mt-auto">
        <div className="d-flex align-items-center">
          <div className="flex-shrink-0">
            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                 style={{ width: '40px', height: '40px' }}>
              <span className="fw-bold">{user?.name?.charAt(0) || 'U'}</span>
            </div>
          </div>
          <div className="flex-grow-1 ms-3">
            <div className="fw-semibold">{user?.name || 'Utilisateur'}</div>
            <small className="text-muted">
              {user?.role === 'admin' ? 'Administrateur' : user?.department}
            </small>
            <div className={`badge ${user?.role === 'admin' ? 'bg-danger' : 'bg-info'} mt-1`}>
              {user?.role === 'admin' ? 'Admin' : (user?.stats?.rank || 'Débutant')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;