import React from 'react';
import { Navigate } from 'react-router-dom';

const HosterProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('hosterToken');
  const hosterData = localStorage.getItem('hosterData');

  if (!token || !hosterData) {
    return <Navigate to="/hoster/login" replace />;
  }

  try {
    const hoster = JSON.parse(hosterData);

    if (!hoster || !hoster.id || hoster.status !== 'approved') {
      localStorage.removeItem('hosterToken');
      localStorage.removeItem('hosterData');
      return <Navigate to="/hoster/login" replace />;
    }

  } catch (err) {
    localStorage.removeItem('hosterToken');
    localStorage.removeItem('hosterData');
    return <Navigate to="/hoster/login" replace />;
  }

  return children;
};

export default HosterProtectedRoute;
