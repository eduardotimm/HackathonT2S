import React, { useState } from "react";
import TextInput from '../../components/TextInput/TextInput';
import Button from '../../components/Button/Button';
import './Register.css';

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirm) {
      setError("As senhas não são iguais.");
    } else {
      setError("");
        // lógica de cadastro - simulate success by storing a user name and redirecting
        // prefer a supplied username, otherwise fall back to the email local-part
        const savedName = username && username.trim() ? username.trim() : (email.split('@')[0] || 'Usuário');
  if (typeof window !== 'undefined') localStorage.setItem('userName', savedName);
  // notify app that auth changed and navigate to projects
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('authChanged'));
  window.location.href = '/projects';
    }
  }

  return (
    <div className="login-container">
      <h2>Criar Conta</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          Nome de usuário:
          <TextInput
            type="text"
            value={username}
            onChange={setUsername}
            placeholder="Escolha um nome de usuário"
            maxLength={30}
            className="login-input"
            required
          />
        </label>

        <label>
          Email:
          <TextInput
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Digite seu email"
            maxLength={80}
            className="login-input"
            required
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
            required
          />
        </label>
        <label>
          Confirmar senha:
          <TextInput
            type="password"
            value={confirm}
            onChange={setConfirm}
            placeholder="Confirme sua senha"
            maxLength={40}
            className="login-input"
            required
          />
        </label>
        <small style={{ color: "#555", marginBottom: "8px", display: "block" }}>
          A senha deve conter letra maiúscula, minúscula, número e caractere especial.
        </small>
        {error && <div style={{ color: "red", marginBottom: "8px" }}>{error}</div>}
        <div className="login-btn-group">
          <Button label="Criar conta" type="submit" className="login-btn" />
        </div>
      </form>
    </div>
  );
}
