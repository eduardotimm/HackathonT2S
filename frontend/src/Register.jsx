import React, { useState } from "react";
import './Login.css';

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirm) {
      setError("As senhas não são iguais.");
    } else {
      setError("");
      // lógica de cadastro
    }
  }

  return (
    <div className="login-container">
      <h2>Criar Conta</h2>
      <form className="login-form" onSubmit={handleSubmit}>
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
        <label>
          Confirmar senha:
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
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
          <button className="login-btn" type="submit">Criar conta</button>
        </div>
      </form>
    </div>
  );
}
