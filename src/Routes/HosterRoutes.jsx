import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import HosterLogin from '../hoster/HosterLogin';
import HosterRegister from '../hoster/HosterRegister'; // Fixed import path
import HosterLayout from '../hoster/HosterLayout';
import HosterDashboard from '../hoster/HosterDashboard';
import HosterEvents from '../hoster/HosterEvents';
import HosterEventForm from '../hoster/HosterEventForm';
import HosterReservations from '../hoster/HosterReservations';
import HosterGuests from '../hoster/HosterGuests';
import HosterSettings from '../hoster/HosterSettings';
import HosterProtectedRoute from '../hoster/HosterProtectRoute';

const HosterRoutes = (
  <>
    <Route path="/hoster/login" element={<HosterLogin />} />
    <Route path="/hoster/register" element={<HosterRegister />} />

    <Route
      path="/hoster"
      element={
        <HosterProtectedRoute>
          <HosterLayout />
        </HosterProtectedRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" />} />
      <Route path="dashboard" element={<HosterDashboard />} />
      <Route path="events" element={<HosterEvents />} />
      <Route path="events/new" element={<HosterEventForm />} />
      <Route path="events/edit/:id" element={<HosterEventForm />} />
      <Route path="reservations" element={<HosterReservations />} />
      <Route path="guests" element={<HosterGuests />} />
      <Route path="settings" element={<HosterSettings />} />
    </Route>
  </>
);

export default HosterRoutes;