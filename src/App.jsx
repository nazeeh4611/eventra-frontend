import React from 'react';
import { Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import UserRoutes from './Routes/UserRoutes'
import AdminRoutes from "./Routes/AdminRoutes"

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" />
      <Routes>
        {UserRoutes}
        {AdminRoutes}
      </Routes>
    </div>
  );
}

export default App;
