import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={e => e.preventDefault()}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Digite seu email"
            maxLength={80}
            className="login-input"
            required
          />
        </label>
        <label>
          Senha:
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            maxLength={40}
            className="login-input"
            required
          />
        </label>
        <div className="login-btn-group">
          <button className="login-btn" type="submit">Login</button>
          <button className="create-btn" type="button" onClick={() => navigate('/register')}>Criar uma conta</button>
        </div>
      </form>
    </div>
  );
}
