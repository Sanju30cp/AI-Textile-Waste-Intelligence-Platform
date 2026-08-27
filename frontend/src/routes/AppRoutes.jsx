import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import RoleRoute from '../components/RoleRoute';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';

// Dashboards
import AdminDashboard from '../pages/dashboards/AdminDashboard';
import ManufacturerDashboard from '../pages/dashboards/ManufacturerDashboard';
import RecyclingDashboard from '../pages/dashboards/RecyclingDashboard';
import SustainabilityDashboard from '../pages/dashboards/SustainabilityDashboard';

import Upload from '../pages/Upload';
import Inventory from '../pages/Inventory';
import Reports from '../pages/Reports';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';
import PredictionHistory from '../pages/PredictionHistory';
import Settings from '../pages/Settings';
import About from '../pages/About';
import ComingSoon from '../pages/ComingSoon';

// Component to handle dynamic /dashboard redirection based on role
function DashboardRouter() {
  const userRole = localStorage.getItem('userRole');
  if (userRole === 'Administrator') return <Navigate to="/admin/dashboard" replace />;
  if (userRole === 'Textile Manufacturer') return <Navigate to="/manufacturer/dashboard" replace />;
  if (userRole === 'Recycling Facility Operator') return <Navigate to="/recycling/dashboard" replace />;
  if (userRole === 'Sustainability Manager') return <Navigate to="/sustainability/dashboard" replace />;
  return <Navigate to="/" replace />;
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
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          
          {/* Textile Manufacturer Only */}
          <Route element={<RoleRoute allowedRoles={['Textile Manufacturer']} />}>
            <Route path="/manufacturer/dashboard" element={<ManufacturerDashboard />} />
          </Route>

          {/* Recycling Operator Only */}
          <Route element={<RoleRoute allowedRoles={['Recycling Facility Operator']} />}>
            <Route path="/recycling/dashboard" element={<RecyclingDashboard />} />
          </Route>

          {/* Sustainability Manager Only */}
          <Route element={<RoleRoute allowedRoles={['Sustainability Manager']} />}>
            <Route path="/sustainability/dashboard" element={<SustainabilityDashboard />} />
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
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
          </Route>

        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
