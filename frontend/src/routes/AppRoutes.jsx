import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import RoleRoute from '../components/RoleRoute';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';

import Upload from '../pages/Upload';
import Inventory from '../pages/Inventory';
import Reports from '../pages/Reports';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';
import PredictionHistory from '../pages/PredictionHistory';
import Settings from '../pages/Settings';
import About from '../pages/About';
import SustainabilityDashboard from '../pages/SustainabilityDashboard';

// Component to handle dynamic /dashboard redirection based on role
function DashboardRouter() {
  return <SustainabilityDashboard />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          
          {/* Dynamic Dashboard Redirect */}
          <Route path="/dashboard" element={<DashboardRouter />} />

          {/* Administrator Only */}
          <Route element={<RoleRoute allowedRoles={['Administrator']} />}>
            <Route path="/settings" element={<Settings />} />
          </Route>
          
          {/* Restricted: No Sustainability Manager (Upload) */}
          <Route element={<RoleRoute allowedRoles={['Administrator', 'Textile Manufacturer', 'Recycling Facility Operator']} />}>
            <Route path="/upload" element={<Upload />} />
          </Route>

          {/* Accessible by All Roles */}
          <Route element={<RoleRoute allowedRoles={['Administrator', 'Textile Manufacturer', 'Recycling Facility Operator', 'Sustainability Manager']} />}>
            <Route path="/history" element={<PredictionHistory />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
          </Route>

        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
