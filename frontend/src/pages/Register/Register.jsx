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
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();
    // client-side validation
    const errs = {};
    if (!username || username.trim().length < 3) errs.username = 'Nome de usuário deve ter ao menos 3 caracteres.';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) errs.email = 'Email inválido.';
    if (!password || password.length < 8) errs.password = 'Senha deve ter ao menos 8 caracteres.';
    if (password !== confirm) errs.confirm = 'As senhas não são iguais.';
    setFieldErrors(errs);
    if (Object.keys(errs).length) return;
    setError("");
    setLoading(true);

    // build payload
    const payload = {
      username: username && username.trim() ? username.trim() : undefined,
      email: email,
      password: password,
    };

    try {
      const res = await fetch('https://localhost:7135/ada/User', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        // response returns UserResponseDto with Username
        const savedName = (data && (data.username || data.Username)) || (username && username.trim()) || (email.split('@')[0] || 'Usuário');
        if (typeof window !== 'undefined') localStorage.setItem('userName', savedName);
        if (typeof window !== 'undefined') window.dispatchEvent(new Event('authChanged'));
        window.location.href = '/projects';
      } else {
        // try to parse error message
        let errText = '';
        try { errText = await res.text(); } catch (_) { errText = `Status ${res.status}`; }
        if (res.status === 409) setError('Este e-mail já está em uso.');
        else setError(errText || `Erro ao registrar (status ${res.status})`);
      }
    } catch (err) {
      setError('Falha ao conectar com o servidor.');
      console.error('Registration error', err);
    }
    finally {
      setLoading(false);
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
            disabled={loading}
          />
        </label>
        {fieldErrors.username && <div style={{ color: 'red', marginTop: 6 }}>{fieldErrors.username}</div>}

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
            disabled={loading}
          />
        </label>
        {fieldErrors.email && <div style={{ color: 'red', marginTop: 6 }}>{fieldErrors.email}</div>}
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
            disabled={loading}
          />
        </label>
        {fieldErrors.password && <div style={{ color: 'red', marginTop: 6 }}>{fieldErrors.password}</div>}
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
            disabled={loading}
          />
        </label>
        {fieldErrors.confirm && <div style={{ color: 'red', marginTop: 6 }}>{fieldErrors.confirm}</div>}
        <small style={{ color: "#555", marginBottom: "8px", display: "block" }}>
          A senha deve conter letra maiúscula, minúscula, número e caractere especial.
        </small>
        {error && <div style={{ color: "red", marginBottom: "8px" }}>{error}</div>}
        <div className="login-btn-group">
          <Button label={loading ? 'Criando...' : 'Criar conta'} type="submit" className="login-btn" disabled={loading} />
        </div>
      </form>
    </div>
  );
}
