import { useState } from 'react';
import { login } from '../api/api';
import { message } from 'antd';

const useLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (passcode: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await login(passcode);
      
      const token = data.token;
      const expiryTime = (Date.now() + 2 * 60 * 60 * 1000).toString();
      
      localStorage.setItem('token', token);
      localStorage.setItem('expiryTime', expiryTime);
      
      message.success(`Login successfully`);
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      console.error('There was a problem with the login operation:', error);
      setError('Login failed. Please try again.');
      message.error(`Login failed. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, error, isLoading };
};

export default useLogin;