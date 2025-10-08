import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import TextInput from '../../components/TextInput/TextInput';
import Button from '../../components/Button/Button';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('login', { email, password });
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          Email:
          <TextInput
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Digite seu email"
            maxLength={80}
            className="login-input"
            ariaLabel="email"
            required
            name="email"
          />
        </label>
        <label>
          Senha:
          <TextInput
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Digite sua senha"
            maxLength={40}
            className="login-input"
            ariaLabel="senha"
            required
            name="password"
          />
        </label>
        <div className="login-btn-group">
          <Button label="Login" type="submit" className="login-btn" />
          <Button label="Criar uma conta" type="button" className="create-btn" onClick={() => navigate('/register')} variant="secondary" />
        </div>
      </form>
    </div>
  );
}
