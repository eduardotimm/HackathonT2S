import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import TextInput from '../../components/TextInput/TextInput';
import Button from '../../components/Button/Button';
import LinkText from '../../components/Link/LinkText';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate successful login: save a userName in localStorage and redirect
    const fakeName = email.split('@')[0] || 'Usuário';
    if (typeof window !== 'undefined') localStorage.setItem('userName', fakeName);
    // notify app that auth changed
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('authChanged'));
    navigate('/');
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
            placeholder="Digite seu e-mail"
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
          <Button label="Continuar ►" type="submit" className="login-btn" />
        </div>

        <div className="login-footer">
          <span>Não possui uma conta?&nbsp;</span>
          <LinkText text="Registre-se" to="/register" className="create-link" />
        </div>
      </form>
    </div>
  );
}
