import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import TextInput from '../../components/TextInput/TextInput';
import Button from '../../components/Button/Button';
import LinkText from '../../components/Link/LinkText';
import './Register.css';
import { api } from '../../services/api';

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpa erros anteriores

    try {
      await api.register(username, email, password);
      // Se chegou aqui, o usuário foi criado com sucesso
      // Você pode redirecionar para o login ou logar o usuário diretamente
      navigate('/login');

    } catch (err) {
      // Captura tanto erros de rede (fetch falhou) quanto os erros que lançamos acima
      console.error("Falha no registro:", err);
      setError(err.message || "Não foi possível conectar ao servidor. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="register-container">
      <h2>Registro</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <label>
          Nome de usuário:
          <TextInput
            value={username}
            onChange={setUsername}
            placeholder="Digite seu nome de usuário"
            required
            name="username"
          />
        </label>
        <label>
          Email:
          <TextInput
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Digite seu e-mail"
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
            placeholder="Mínimo de 6 caracteres"
            required
            name="password"
          />
        </label>
        {error && <p className="error-message">{error}</p>}
        <div className="register-btn-group">
          <Button label="Registrar ►" type="submit" className="register-btn" />
        </div>
        <div className="register-footer">
          <span>Já possui uma conta?&nbsp;</span>
          <LinkText text="Faça login" to="/login" className="login-link" />
        </div>
      </form>
    </div>
  );
}