import React from "react";
import { useNavigate } from 'react-router-dom';
import './CentralForm.css';
import TextInput from '../../components/TextInput/TextInput';
import FileInput from '../../components/FileInput/FileInput';
import Button from '../../components/Button/Button';

export default function CentralForm() {
  const navigate = useNavigate();
  const [projectName, setProjectName] = React.useState('');
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

  const handleOk = () => {
    console.log({ projectName, url, file });
    navigate('/');
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
