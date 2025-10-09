import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, loginPath = '/login' }) {
  let logged = null;
  try {
    logged = typeof window !== 'undefined' ? localStorage.getItem('userName') : null;
  } catch (e) {
    logged = null;
  }

  if (!logged) return <Navigate to={loginPath} replace />;
  return children;
}
