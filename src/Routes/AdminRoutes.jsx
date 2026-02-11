import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import AdminLogin from '../admin/AdminLogin';
import AdminLayout from '../admin/AdminLayout';
import AdminDashboard from '../admin/AdminDashboard';
import AdminHosters from '../admin/AdminHosters';
import AdminEvents from '../admin/AdminEvents';
import AdminReservations from '../admin/AdminReservations';
import AdminGuestList from '../admin/AdminGuestList';
import AdminCarousel from '../admin/AdminCarousel';
import AdminSettings from '../admin/AdminSettings';
import AdminProtectedRoute from '../admin/AdminProtectedRoute';

const AdminRoutes = (
  <>
    <Route path="/admin/login" element={<AdminLogin />} />

    <Route
      path="/admin"
      element={
        <AdminProtectedRoute>
          <AdminLayout />
        </AdminProtectedRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="hosters" element={<AdminHosters />} />
      <Route path="events" element={<AdminEvents />} />
      <Route path="reservations" element={<AdminReservations />} />
      <Route path="guestlist" element={<AdminGuestList />} />
      <Route path="carousel" element={<AdminCarousel />} />
      <Route path="settings" element={<AdminSettings />} />
    </Route>
  </>
);

export default AdminRoutes;