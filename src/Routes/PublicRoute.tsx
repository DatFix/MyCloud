import { Navigate } from 'react-router-dom';

interface PublicRouteProps {
  children: JSX.Element;
  isAuthenticated: boolean;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children, isAuthenticated }) => {
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;
