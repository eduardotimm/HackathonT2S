import React from "react";
import { useNavigate } from 'react-router-dom';
import './CentralForm.css';
import TextInput from '../../components/TextInput/TextInput';
import FileInput from '../../components/FileInput/FileInput';
import Button from '../../components/Button/Button';
import { api } from '../../services/api';

export default function CentralForm() {
  const navigate = useNavigate();
  const [projectName, setProjectName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [url, setUrl] = React.useState("");
  const [file, setFile] = React.useState(null);

  const handleUrlChange = (value) => {
    setUrl(value);
    if (value) setFile(null);
  };

  const handleFileChange = (f) => {
    setFile(f || null);
    if (f) setUrl('');
  };

  const handleOk = async () => {
    console.log({ projectName, description, url, file });

    // Pega os dados do usuário do localStorage
    const userString = localStorage.getItem('user');
    if (!userString) {
      alert("Você precisa estar logado para criar um projeto.");
      navigate('/login'); // Redireciona para o login
      return;
    }

    const user = JSON.parse(userString);
    const userId = user.userID; // Usa o ID do usuário logado

    // Só aceita URL preenchida e não arquivo
    if (url && !file) {
      const payload = {
        name: projectName,
        repoURL: url,
        description: description
      };

      try {
        const data = await api.createProject(userId, payload);
        console.log('Projeto criado:', data);
        navigate('/', { state: { message: `Projeto "${data.name}" criado com sucesso!` } });
      } catch (err) {
        console.error('Erro ao criar projeto:', err);
        alert('Erro ao criar projeto: ' + err.message);
      }

    } else {
      // comportamento atual (navegar de volta)
      navigate('/');
    }
  };

  return (
    <div className="central-container">
      <header className="home-hero">
        <h1 className="hero-title">Avalie seu código em segundos</h1>
        <p className="hero-sub">Cole a URL do seu repositório ou envie um arquivo. Receba uma nota automática com insights de qualidade.</p>
      </header>
      <TextInput
        value={projectName}
        onChange={setProjectName}
        placeholder="Digite o nome do projeto"
        maxLength={200}
      />

      <TextInput
        value={description}
        onChange={setDescription}
        placeholder="Descrição do projeto"
        maxLength={1000}
      />

      <TextInput
        value={url}
        onChange={handleUrlChange}
        placeholder="Digite sua Url"
        maxLength={200}
        disabled={!!file}
        className={file ? 'input-disabled' : ''}
      />

      <div className="cf-row">
        <FileInput onChange={handleFileChange} disabled={!!url} />
        <Button label="OK" onClick={handleOk} />
      </div>
    </div>
  );
}
