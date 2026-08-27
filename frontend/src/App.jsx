import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  useEffect(() => {
    // Force light mode by default
    localStorage.setItem('theme', 'light');
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
