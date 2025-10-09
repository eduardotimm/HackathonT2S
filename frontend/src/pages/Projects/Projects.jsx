import React from 'react';
import ProjectList from '../../components/ProjectList/ProjectList';
import useProjects from '../../hooks/useProjects';
import './Projects.css';

export default function Projects() {
  const storedName = typeof window !== 'undefined' ? localStorage.getItem('userName') : null;
  const ownerName = storedName || 'Você';

  const { projects, loading, error, searchTerm, setSearchTerm, sortOption, setSortOption } = useProjects({ userId: 1 });

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>Meus Projetos</h1>
        <p>Gerencie todos os seus projetos em um só lugar</p>
      </div>

      <div className="projects-container">
        {loading ? (
          <div>Carregando projetos...</div>
        ) : error ? (
          <div className="project-error">Erro: {error}</div>
        ) : (
          <ProjectList
            projects={projects}
            ownerName={ownerName}
            onSearch={(v) => setSearchTerm(v)}
            onSort={(v) => setSortOption(v)}
          />
        )}
      </div>
    </div>
  );
}
