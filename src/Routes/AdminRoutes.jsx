import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import AdminLogin from '../admin/AdminLogin';
import AdminLayout from '../admin/AdminLayout';
import AdminDashboard from '../admin/AdminDashboard';
import AdminEvents from '../admin/AdminEvents';
import AdminEventForm from '../admin/AdminEventForm';
import AdminReservations from '../admin/AdminReservations';
import AdminGuestList from '../admin/AdminGuestList';
import AdminCarousel from '../admin/AdminCarousel';
import AdminSettings from '../admin/AdminSettings';
import ProtectedRoute from '../admin/ProtectedRoute';

const AdminRoutes = (
  <>
    <Route path="/admin/login" element={<AdminLogin />} />

    <Route
      path="/admin"
      element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="events" element={<AdminEvents />} />
      <Route path="events/new" element={<AdminEventForm />} />
      <Route path="events/edit/:id" element={<AdminEventForm />} />
      <Route path="reservations" element={<AdminReservations />} />
      <Route path="guestlist" element={<AdminGuestList />} />
      <Route path="carousel" element={<AdminCarousel />} />
      <Route path="settings" element={<AdminSettings />} />
    </Route>
  </>
);

export default AdminRoutes;
