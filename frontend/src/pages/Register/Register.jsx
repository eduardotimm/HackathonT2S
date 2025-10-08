import React, { useState } from "react";
import TextInput from '../../components/TextInput/TextInput';
import Button from '../../components/Button/Button';
import './Register.css';

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
