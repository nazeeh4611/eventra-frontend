import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  const adminData = localStorage.getItem('adminData');

  if (!token || !adminData) {
    return <Navigate to="/admin/login" replace />;
  }

  try {
    const admin = JSON.parse(adminData);

    if (!admin || !admin.id) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      return <Navigate to="/admin/login" replace />;
    }

  } catch (error) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
