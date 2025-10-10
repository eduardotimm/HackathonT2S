import React from 'react';
import sanitizeFilename from '../../utils/sanitizeFilename';
import './DownloadButton.css';

export default function DownloadButton({ projectId, projectTitle }) {
  const handle = async (e) => {
    e.stopPropagation();
    const filename = `Relatorio-${sanitizeFilename(projectTitle)}.md`;
    try {
      const res = await fetch(`/ada/projects/${projectId}/download-md`);
      if (!res.ok) throw new Error(await res.text());
      const text = await res.text();
      const blob = new Blob([text], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      // A mensagem de erro detalhada vem do backend.
      const errorMessage = err.message || 'Não foi possível obter detalhes do erro.';
      console.error('Erro ao baixar .md:', errorMessage);
      alert('Erro ao baixar o relatório:\n\n' + errorMessage);
    }
  };

  return (
    <button className="download-md" onClick={handle} aria-label={`Download relatório ${projectTitle}`}>
      Relatorio-{projectTitle}.md
    </button>
  );
}
