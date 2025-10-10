import React from 'react';
import sanitizeFilename from '../../utils/sanitizeFilename';
import './DownloadButton.css';

const generateMarkdownContent = (details) => {
  if (!details || !details.pythonRatingDetails) return '';

  const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  let content = [
    `# 📈 Relatório de Análise de Código: ${details.name}`,
    `---`,
    `**Pontuação Média Final: ${details.averageScore?.toFixed(1)}/100**\n`,
  ];

  details.pythonRatingDetails.forEach(rating => {
    content.push(`## ${rating.criterio} - Nota: ${rating.nota}/100`);
    content.push(rating.justificativa);
    content.push('\n---');
  });

  content.push(`\n*Relatório gerado em: ${timestamp}*`);

  return content.join('\n\n'); // Use double newline for better spacing in Markdown
};

export default function DownloadButton({ analysisDetails }) {
  const handle = async (e) => {
    e.stopPropagation();
    if (!analysisDetails || analysisDetails.error) {
      alert("Os detalhes da análise não estão disponíveis para gerar o relatório.");
      return;
    }
    const filename = `Relatorio-${sanitizeFilename(analysisDetails.name)}.md`;
    const markdownContent = generateMarkdownContent(analysisDetails);

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button className="download-md" onClick={handle} aria-label={`Download relatório ${analysisDetails?.name || ''}`} disabled={!analysisDetails || analysisDetails.error}>
      Baixar Relatório (.md)
    </button>
  );
}
