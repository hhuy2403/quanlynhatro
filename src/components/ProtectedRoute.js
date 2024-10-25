import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ roleRequired, children }) => {
  const userInfo = JSON.parse(localStorage.getItem('user_info'));
  const userRole = userInfo?.role?.name?.toLowerCase() || '';

  if (userRole !== roleRequired) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
