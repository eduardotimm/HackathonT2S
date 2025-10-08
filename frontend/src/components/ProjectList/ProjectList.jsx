import React from 'react';
import './ProjectList.css';

export default function ProjectList({ projects = [], onSearch = () => {}, onSort = () => {} }) {
  return (
    <div className="project-list-card">
      <div className="project-list-header">
        <h3>Projetos de Arthur</h3>
        <div className="project-list-controls">
          <input className="project-search" placeholder="Buscar projetos..." onChange={e => onSearch(e.target.value)} />
          <select className="project-sort" onChange={e => onSort(e.target.value)}>
            <option value="recent">Mais recentes</option>
            <option value="old">Mais antigos</option>
            <option value="name">Nome</option>
          </select>
        </div>
      </div>

      <div className="project-list-body">
        {projects.length === 0 ? (
          <div className="project-empty">Nenhum projeto encontrado</div>
        ) : (
          <ul className="project-items">
            {projects.map(p => (
              <li key={p.id} className="project-item">
                <div className="project-item-left">
                  <div className="project-item-title">{p.title}</div>
                  <div className="project-item-sub">{p.subtitle}</div>
                </div>
                <div className="project-item-right">{p.meta}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
