import React, { useEffect } from 'react';
import { Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import UserRoutes from './Routes/UserRoutes';
import AdminRoutes from './Routes/AdminRoutes';
import HosterRoutes from './Routes/HosterRoutes';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
};

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(168,85,247,0.3)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <ScrollToTop />
      <Routes>
        {UserRoutes}
        {AdminRoutes}
        {HosterRoutes}
      </Routes>
    </div>
  );
}

export default App;