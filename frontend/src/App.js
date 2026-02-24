import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DiscoveryPage from './pages/DiscoveryPage';
import MyProfilePage from './pages/MyProfilePage';
import SettingsPage from './pages/SettingsPage'; // Ajouter cette ligne

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Chargement...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Pages publiques */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* Pages protégées */}
      <Route path="/app/discovery" element={
        <ProtectedRoute>
          <DiscoveryPage />
        </ProtectedRoute>
      } />
      <Route path="/app/profile/:id" element={
        <ProtectedRoute>
          <MyProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/app/my-profile" element={
        <ProtectedRoute>
          <MyProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/app/settings" element={  
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      } />
      <Route path="/app/profile" element={
        <ProtectedRoute>
          <Navigate to="/app/my-profile" />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;