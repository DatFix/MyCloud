import React, { useState } from 'react';
import './style.global.css';
import useFetch from '../../hooks/useFetch'; // Import đúng hook

const LoginForm = () => {
  const [password, setPassword] = useState(['', '', '', '', '', '']);
  const { handleLogin, isLoading } = useFetch();

  const handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const newPassword = [...password];

    newPassword[index] = value;

    if (value && index < password.length - 1) {
      document.getElementById(`input-${index + 1}`)?.focus();
    }

    setPassword(newPassword);

    if (newPassword.every((char) => char) && newPassword.length === 6) {
      handleLogin(
        newPassword.join('')
      ); 
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !password[index] && index > 0) {
      document.getElementById(`input-${index - 1}`)?.focus();
    }
  };

  return (
    <div className="password-container">
      <h1>Welcome to My Cloud</h1>
      <div className="input-boxes">
        {password.map((value, index) => (
          <input
            key={index}
            id={`input-${index}`}
            type="password"
            maxLength={1}
            value={value}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="otp-input"
          />
        ))}
      </div>
      {isLoading && <p>Loading...</p>}
    </div>
  );
};

export default LoginForm;
