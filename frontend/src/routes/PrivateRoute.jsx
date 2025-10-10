import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, loginPath = '/login' }) {
  let logged = null;
  try {
    const userString = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const userName = typeof window !== 'undefined' ? localStorage.getItem('userName') : null;
    logged = userString || token || userName;
  } catch (e) {
    logged = null;
  }

  if (!logged) return <Navigate to={loginPath} replace />;
  return children;
}
