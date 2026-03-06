import React, { useState } from 'react';
import { FaEdit, FaTrash, FaUserPlus, FaSearch, FaFilter } from 'react-icons/fa';

const UserTable = ({ users, onEdit, onDelete, onCreate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(filteredUsers.map(u => u._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Supprimer ${selectedUsers.length} utilisateur(s) ?`)) {
      selectedUsers.forEach(id => onDelete(id));
      setSelectedUsers([]);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'admin': return 'danger';
      case 'mentor': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <div className="card">
      <div className="card-header bg-white">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h6 className="mb-0">Gestion des utilisateurs</h6>
          </div>
          <div className="col-md-6">
            <div className="d-flex gap-2 justify-content-end">
              <button 
                className="btn btn-success btn-sm"
                onClick={onCreate}
              >
                <FaUserPlus className="me-1" />
                Nouvel utilisateur
              </button>
              {selectedUsers.length > 0 && (
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={handleBulkDelete}
                >
                  <FaTrash className="me-1" />
                  Supprimer ({selectedUsers.length})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card-body">
        {/* Filtres */}
        <div className="row mb-3">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="input-group">
              <span className="input-group-text">
                <FaFilter />
              </span>
              <select 
                className="form-select"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">Tous les rôles</option>
                <option value="user">Utilisateurs</option>
                <option value="mentor">Mentors</option>
                <option value="admin">Administrateurs</option>
              </select>
            </div>
          </div>
          <div className="col-md-3">
            <small className="text-muted">
              {filteredUsers.length} utilisateur(s) trouvé(s)
            </small>
          </div>
        </div>

        {/* Tableau des utilisateurs */}
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th width="40">
                  <input 
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Utilisateur</th>
                <th>Département</th>
                <th>Rôle</th>
                <th>Compétences</th>
                <th>Statistiques</th>
                <th>Inscription</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td>
                    <input 
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleSelectUser(user._id)}
                    />
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2"
                           style={{ width: '32px', height: '32px' }}>
                        <span className="text-white fw-bold">
                          {user.name?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="fw-semibold">{user.name}</div>
                        <small className="text-muted">{user.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>{user.department || '-'}</td>
                  <td>
                    <span className={`badge bg-${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-info">
                      {user.skills?.length || 0}
                    </span>
                  </td>
                  <td>
                    <small>
                      <div>⏱️ {user.stats?.hoursMentored || 0}h</div>
                      <div>👥 {user.stats?.colleaguesHelped || 0}</div>
                    </small>
                  </td>
                  <td>
                    <small className="text-muted">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </small>
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline-primary me-1"
                      onClick={() => onEdit(user)}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete(user._id)}
                      disabled={user.role === 'admin' && user._id === JSON.parse(localStorage.getItem('user'))._id}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserTable;