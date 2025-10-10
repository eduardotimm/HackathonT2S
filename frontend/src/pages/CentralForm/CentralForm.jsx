import React from "react";
import { useNavigate } from 'react-router-dom';
import './CentralForm.css';
import TextInput from '../../components/TextInput/TextInput';
import FileInput from '../../components/FileInput/FileInput';
import Button from '../../components/Button/Button';

export default function CentralForm() {
  const navigate = useNavigate();
  const [projectName, setProjectName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [url, setUrl] = React.useState("");
  const [file, setFile] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [modalContent, setModalContent] = React.useState({ title: '', body: '' });
  const [mdText, setMdText] = React.useState('');
  const [showMdPreview, setShowMdPreview] = React.useState(false);

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

    // Só aceita URL preenchida e não arquivo
    const userId = 1; // TODO: substituir pelo ID do usuário autenticado
    if (url && !file) {
      const payload = {
        name: projectName,
        repoURL: url,
        description: description
      };

      const token = localStorage.getItem('token');

      fetch(`https://localhost:7135/ada/users/${userId}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Adiciona o token de autorização
        },
        body: JSON.stringify(payload)
      })
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            throw new Error(`${res.status} ${text}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log('Projeto criado:', data);
          navigate('/');
        })
        .catch((err) => {
          console.error('Erro ao criar projeto:', err);
          alert('Erro ao criar projeto: ' + err.message);
        });
    } else {
      // comportamento atual (navegar de volta)
      navigate('/');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    navigate('/');
  };

  const handleCopyMd = async () => {
    try {
      await navigator.clipboard.writeText(mdText);
      alert('Conteúdo copiado para a área de transferência.');
    } catch (e) {
      alert('Não foi possível copiar: ' + e.message);
    }
  };

  const handleDownloadMd = () => {
    const blob = new Blob([mdText], { type: 'text/markdown' });
    const urlBlob = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = urlBlob;
    a.download = (projectName || 'report') + '.md';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(urlBlob);
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
        placeholder="Digite sua Url"
        maxLength={200}
      />

      <TextInput
        value={description}
        onChange={setDescription}
        placeholder="Digite o nome do Projeto"
        maxLength={1000}
      />

      <TextInput
        value={url}
        onChange={handleUrlChange}
        placeholder="Digite a descrição do Projeto"
        maxLength={200}
        disabled={!!file}
        className={file ? 'input-disabled' : ''}
      />

      <div className="cf-row">
        <FileInput onChange={handleFileChange} disabled={!!url} />
        <Button label="OK" onClick={handleOk} />
      </div>

      {showMdPreview && (
        <div className="md-preview" aria-live="polite">
          <div dangerouslySetInnerHTML={{ __html: mdToHtml(mdText) }} />
          <div className="md-actions">
            <button className="md-copy-btn" onClick={handleCopyMd}>Copiar</button>
            <button className="md-download-btn" onClick={handleDownloadMd}>Baixar .md</button>
          </div>
        </div>
      )}
      <Modal show={showModal} onClose={closeModal} title={modalContent.title}>
        <p>{modalContent.body}</p>
      </Modal>
    </div>
  );
}
