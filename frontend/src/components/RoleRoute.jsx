import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Route guard component to restrict access based on user role.
 * Checks localStorage for 'userRole' and compares it against allowed roles.
 */
export default function RoleRoute({ allowedRoles }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If the user's role is not in the allowed list, redirect to the dashboard
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
