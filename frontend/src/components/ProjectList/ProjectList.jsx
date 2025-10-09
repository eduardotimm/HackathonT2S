import React, { useState } from 'react';
import './ProjectList.css';
import DownloadButton from '../DownloadButton/DownloadButton';

function getLoggedInUser() {
  if (typeof window === 'undefined') return null;
  const userString = localStorage.getItem('user');
  return userString ? JSON.parse(userString) : null;
}

export default function ProjectList({ projects = [], onSearch = () => {}, onSort = () => {}, ownerName }) {
  const [expandedId, setExpandedId] = useState(null);
  const loggedInUser = getLoggedInUser();
  const displayName = ownerName || loggedInUser?.username || 'Você';

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
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
                      <DownloadButton projectId={p.id} projectTitle={p.title} />
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
