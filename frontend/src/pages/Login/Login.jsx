import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import TextInput from '../../components/TextInput/TextInput';
import Button from '../../components/Button/Button';
import LinkText from '../../components/Link/LinkText';
import './Login.css';
import { api } from '../../services/api'; // Importa o serviço de API

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpa erros anteriores

    try {
      const userData = await api.login(email, password);

      // Salva os dados do usuário no localStorage para manter a sessão
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(userData));
        // Salva o token separadamente para facilitar o acesso
        localStorage.setItem('token', userData.token);
        // Dispara um evento para que outras partes da aplicação (como o Header) saibam que o login ocorreu
        window.dispatchEvent(new Event('authChanged'));
      }

      navigate('/'); // Redireciona para a página inicial
    } catch (err) {
      console.error("Erro no login:", err);
      setError(err.message);
    }
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
        {error && <p className="error-message">{error}</p>}
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
