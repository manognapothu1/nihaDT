import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SubmitComplaintPage from './pages/SubmitComplaintPage';
import ComplaintListPage from './pages/ComplaintListPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import Layout from './components/Layout';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('complaintUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('complaintToken');
    localStorage.removeItem('complaintUser');
    setUser(null);
    navigate('/login');
  };

  const handleLogin = (userData) => {
    localStorage.setItem('complaintUser', JSON.stringify(userData));
    localStorage.setItem('complaintToken', userData.token);
    setUser(userData);
    navigate(userData.role === 'admin' ? '/admin' : '/dashboard');
  };

  const ProtectedRoute = ({ children, role }) => {
    if (!user) return <Navigate to="/login" replace />;
    if (role && user.role !== role) {
      return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
    }
    return children;
  };

  return (
    <Layout user={user} onLogout={handleLogout}>
      <Routes>
        <Route
          path="/"
          element={
            user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/login"
          element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace /> : <RegisterPage onLogin={handleLogin} />}
        />
        <Route path="/dashboard" element={<ProtectedRoute>{<DashboardPage user={user} />}</ProtectedRoute>} />
        <Route path="/submit" element={<ProtectedRoute>{<SubmitComplaintPage user={user} />}</ProtectedRoute>} />
        <Route path="/complaints" element={<ProtectedRoute>{<ComplaintListPage user={user} />}</ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute>{<ProfilePage user={user} />}</ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute role="admin">{<AdminDashboardPage user={user} />}</ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
