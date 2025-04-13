import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, ProtectedRoute, useAuth } from './contexts/AuthContext';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import SubmissionPage from './pages/SubmissionPage';
import SubmissionsPage from './pages/SubmissionsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={
        <MainLayout>
          <HomePage />
        </MainLayout>
      } />
      <Route path="/login" element={
        user ? <Navigate to="/" replace /> : <LoginPage />
      } />
      <Route path="/register" element={
        user ? <Navigate to="/" replace /> : <RegisterPage />
      } />

      {/* Protected routes */}
      <Route path="/submit" element={
        <ProtectedRoute>
          <MainLayout>
            <SubmissionPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/submissions" element={
        <ProtectedRoute>
          <MainLayout>
            <SubmissionsPage />
          </MainLayout>
        </ProtectedRoute>
      } />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
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

