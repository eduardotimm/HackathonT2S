import React, { useState } from 'react';
import './ProjectList.css';

export default function ProjectList({ projects = [], onSearch = () => {}, onSort = () => {}, ownerName }) {
  const [expandedId, setExpandedId] = useState(null);
  const stored = (typeof window !== 'undefined' && localStorage.getItem('userName')) || null;
  const displayName = ownerName || stored || 'Você';

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const downloadMd = async (projectId) => {
    try {
      const res = await fetch(`https://localhost:7135/ada/projects/${projectId}/download-md`);
      if (!res.ok) throw new Error(await res.text());
      const text = await res.text();
      const blob = new Blob([text], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  // filename will be set when invoking download from the button click handler
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
    <div className="project-list-card">
      <div className="project-list-header">
        <h3>{`Projetos de ${displayName}`}</h3>
        <div className="project-list-controls">
          <input className="project-search" placeholder="Buscar projetos..." onChange={e => onSearch(e.target.value)} />
          <select className="project-sort" onChange={e => onSort(e.target.value)}>
            <option value="recent">Mais recentes</option>
            <option value="old">Mais antigos</option>
            <option value="name">A-Z</option>
          </select>
        </div>
      </div>

      <div className="project-list-body">
        {projects.length === 0 ? (
          <div className="project-empty">Nenhum projeto encontrado</div>
        ) : (
          <ul className="project-items">
            {projects.map(p => (
              <React.Fragment key={p.id}>
                <li className="project-item" onClick={() => toggleExpand(p.id)}>
                  <div className="project-item-left">
                      <div className={`chev ${expandedId === p.id ? 'open' : ''}`} aria-hidden="true"></div>
                      <div className="project-item-title">{p.title}</div>
                      <div className="project-item-sub">{p.subtitle}</div>
                    </div>
                  <div className="project-item-right">{p.meta}</div>
                </li>

                {expandedId === p.id && (
                  <li className="project-item-expanded">
                    <div className="expanded-left"></div>
                    <div className="expanded-right">
                      <button className="download-md" onClick={async (e) => {
                        e.stopPropagation();
                        // sanitize project title for filename
                        const sanitize = (s) => s ? s.replace(/[^a-z0-9\-_. ]/gi, '').replace(/\s+/g, '_') : 'project';
                        const filename = `Relatorio-${sanitize(p.title)}.md`;
                        try {
                          // fetch content
                          const res = await fetch(`https://localhost:7135/ada/projects/${p.id}/download-md`);
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
                      }}>Relatorio-{p.title}.md</button>
                    </div>
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
