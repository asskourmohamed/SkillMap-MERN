import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
//weird
const AdminLayout = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/users" element={<AdminDashboard />} />
      <Route path="/skills" element={<AdminDashboard />} />
    </Routes>
  );
};

export default AdminLayout;