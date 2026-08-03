import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Route guard component to restrict access to authenticated users.
 * Checks localStorage for 'isAuthenticated' flag.
 */
export default function ProtectedRoute() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    // Redirect unauthenticated users to the Login page
    return <Navigate to="/" replace />;
  }

  // Render child routes
  return <Outlet />;
}
