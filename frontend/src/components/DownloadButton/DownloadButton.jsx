import React from 'react';
import sanitizeFilename from '../../utils/sanitizeFilename';
import './DownloadButton.css';

export default function DownloadButton({ projectId, projectTitle, apiBase = 'https://localhost:7135' }) {
  const handle = async (e) => {
    e.stopPropagation();
    const filename = `Relatorio-${sanitizeFilename(projectTitle)}.md`;
    try {
      const res = await fetch(`${apiBase}/ada/projects/${projectId}/download-md`);
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
      console.error('Erro ao baixar .md', err);
      alert('Erro ao baixar .md: ' + err.message);
    }
  };

  return (
    <button className="download-md" onClick={handle} aria-label={`Download relatório ${projectTitle}`}>
      Relatorio-{projectTitle}.md
    </button>
  );
}
