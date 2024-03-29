import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const userToken = sessionStorage.getItem('user');
  return userToken ? <Outlet /> : <Navigate to="/login" />;;
};

export default ProtectedRoute;
