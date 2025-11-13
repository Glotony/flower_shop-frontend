import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    // redirect to register if not authenticated
    return <Navigate to="/register" replace />;
  }

  return children;
}
