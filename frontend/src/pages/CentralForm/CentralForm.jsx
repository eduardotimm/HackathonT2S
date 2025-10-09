import React from "react";
import { useNavigate } from 'react-router-dom';
import './CentralForm.css';
import TextInput from '../../components/TextInput/TextInput';
import FileInput from '../../components/FileInput/FileInput';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';

// Minimal markdown -> HTML converter for basic rendering (no dependency)
function mdToHtml(md) {
  if (!md) return '';
  // Escape HTML
  const esc = md.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // Convert headings
  let html = esc.replace(/^###### (.*$)/gim, '<h6>$1</h6>')
    .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>');
  // Bold and italic
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>');
  // Links [text](url)
  html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  // Code blocks ``` ```
  html = html.replace(/```([\s\S]*?)```/gim, function(m, p1){ return '<pre><code>' + p1.replace(/</g,'&lt;') + '</code></pre>'; });
  // Inline code
  html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');
  // Paragraphs
  html = html.replace(/\n\s*\n/gim, '</p><p>');
  html = '<p>' + html + '</p>';
  return html;
}

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

  const handleOk = () => {
    console.log({ projectName, description, url, file });

    // Só aceita URL preenchida e não arquivo
    const userId = 1; // TODO: substituir pelo ID do usuário autenticado
    if (url && !file) {
      const payload = {
        name: projectName,
        repoURL: url,
        description: description
      };

      fetch(`https://localhost:7135/ada/users/${userId}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            throw new Error(`${res.status} ${text}`);
          }
          // The backend will return a markdown file/text. Read as text
          const text = await res.text();
          return text;
        })
        .then((text) => {
          console.log('Resposta Markdown recebida');
          // show preview and provide actions
          setMdText(text || '');
          setShowMdPreview(true);
          // clear inputs
          setProjectName('');
          setDescription('');
          setUrl('');
          // clear file input by setting null - FileInput component should handle this via onChange(null)
          setFile(null);
          setModalContent({ title: 'Sucesso!', body: 'Seu projeto foi criado e o relatório foi gerado abaixo.' });
          setShowModal(true);
        })
        .catch((err) => {
          console.error('Erro ao criar projeto:', err);
          setModalContent({ title: 'Erro!', body: 'Erro ao criar projeto: ' + err.message });
          setShowModal(true);
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
