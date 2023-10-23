import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface PrivateRouteProps {
  element: React.ReactElement; // element to be renderd
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated); // get user exists status from redux
  return isAuthenticated ? element : <Navigate to="/signin" />;
};

export default PrivateRoute;