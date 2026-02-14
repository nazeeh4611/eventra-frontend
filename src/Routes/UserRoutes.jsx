import React from 'react';
import { Route } from 'react-router-dom';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import Home from '../pages/Home';
import Events from '../pages/Events';
import EventDetail from '../pages/EventDetail';
import About from '../pages/About';
import Contact from '../pages/Contact';
import TermsAndConditions from '../pages/Terms';
import PrivacyPolicy from '../pages/Privacy';

const UserLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

const UserRoutes = (
  <>
    <Route
      path="/"
      element={
        <UserLayout>
          <Home />
        </UserLayout>
      }
    />

    <Route
      path="/events"
      element={
        <UserLayout>
          <Events />
        </UserLayout>
      }
    />

    <Route
      path="/events/:id"
      element={
        <UserLayout>
          <EventDetail />
        </UserLayout>
      }
    />

    <Route
      path="/about"
      element={
        <UserLayout>
          <About />
        </UserLayout>
      }
    />

    <Route
      path="/contact"
      element={
        <UserLayout>
          <Contact />
        </UserLayout>
      }
    />
    <Route
      path="/terms-conditions"
      element={
        <UserLayout>
          <TermsAndConditions />
        </UserLayout>
      }
    />
    <Route
      path="/privacy-policy"
      element={
        <UserLayout>
          <PrivacyPolicy />
        </UserLayout>
      }
    />

    <Route
      path="*"
      element={
        <UserLayout>
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-8">Page not found</p>
              <a href="/" className="btn-primary">Go Home</a>
            </div>
          </div>
        </UserLayout>
      }
    />
  </>
);

export default UserRoutes;