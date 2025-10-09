import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PublicRoute({ children, redirectTo = '/' }) {
  let logged = null;
  try {
    logged = typeof window !== 'undefined' ? localStorage.getItem('userName') : null;
  } catch (e) {
    logged = null;
  }

  if (logged) return <Navigate to={redirectTo} replace />;
  return children;
}
