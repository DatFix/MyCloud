import { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../components/home/home';
import LoginForm from '../components/login/login';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const AppRoute: FC = () => {
  
  const token = localStorage.getItem('token');
  const expiryTime = localStorage.getItem('expiryTime');
  const isTokenExpired = expiryTime ? Date.now() > parseInt(expiryTime) : true;
  const isAuthenticated = token ? true : false; //!!token

  if (isTokenExpired) {
    localStorage.removeItem('token');
    localStorage.removeItem('expiryTime');
  }



  return (
    <Router>
      <Routes>
        <Route
          path="/*"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute isAuthenticated={isAuthenticated}>
              <LoginForm />
            </PublicRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoute;
