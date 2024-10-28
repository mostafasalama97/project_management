import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ roles }) => {
  const { auth } = useContext(AuthContext);

  if (!auth.token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(auth.user.role)) {
    return <Navigate to="/projects" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
