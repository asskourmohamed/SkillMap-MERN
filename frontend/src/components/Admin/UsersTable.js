import React, { useState } from 'react';
import { Edit2, Trash2, Shield, Search, Plus } from 'lucide-react';

const UsersTable = ({ users, loading, onEdit, onDelete, onRoleChange, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
          <Shield className="w-3 h-3 mr-1" />
          Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
        User
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-sm"
            />
          </div>
          
          <button className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            Nouvel utilisateur
          </button>
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-900/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Nom</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Département</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Rôle</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Compétences</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {users?.map((user) => (
              <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-sm font-semibold">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.jobTitle || '—'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{user.email}</td>
                <td className="px-4 py-3 text-sm">{user.department || '—'}</td>
                <td className="px-4 py-3">
                  {getRoleBadge(user.role)}
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-medium">
                    {user.skills?.length || 0}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRoleChange(user)}
                      className="p-1 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded"
                      title="Changer rôle"
                    >
                      <Shield className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(user)}
                      className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-end gap-2">
          <button className="px-3 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800">
            Précédent
          </button>
          <button className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90">
            1
          </button>
          <button className="px-3 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800">
            2
          </button>
          <button className="px-3 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800">
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;