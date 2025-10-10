import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PublicRoute({ children, redirectTo = '/' }) {
  let logged = null;
  try {
    // Verifica chaves mais confiáveis: 'user' (objeto serializado) ou 'token'.
    const userString = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    // Mantém compatibilidade com eventuais armazenamentos antigos em 'userName'
    const userName = typeof window !== 'undefined' ? localStorage.getItem('userName') : null;
    logged = userString || token || userName;
  } catch (e) {
    logged = null;
  }

  if (logged) return <Navigate to={redirectTo} replace />;
  return children;
}
