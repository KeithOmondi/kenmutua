import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  selectIsAuthenticated,
  selectIsInitializing,
} from '../store/slice/authSlice';

export default function ProtectedRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isInitializing  = useSelector(selectIsInitializing);
  const location        = useLocation();

  // Boot check still in flight — render nothing until resolved
  if (isInitializing) return null;

  // Not authenticated — redirect to login, preserve intended destination
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}