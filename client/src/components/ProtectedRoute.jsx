import React from 'react'
import { Navigate } from 'react-router-dom';

function ProtectedRoute({children}) {
    const token = localStorage.getItem('token');
    if(!token) {
      localStorage.removeItem('token')
      alert('Please log in first!')
      return <Navigate to="/" />;
    }
  return children;
}

export default ProtectedRoute;
