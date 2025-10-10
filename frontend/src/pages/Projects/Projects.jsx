import React from 'react';
import ProjectList from '../../components/ProjectList/ProjectList';
import useProjects from '../../hooks/useProjects';
import './Projects.css';

export default function Projects() {
  const storedName = typeof window !== 'undefined' ? localStorage.getItem('userName') : null;
  const ownerName = storedName || 'Você';

  // Tenta obter o usuário logado do localStorage. O backend retorna um objeto 'user' no login.
  let userId = null;
  try {
    const userString = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (userString) {
      const parsed = JSON.parse(userString);
      userId = parsed?.userID || parsed?.UserID || parsed?.id || parsed?.userId || null;
    }
  } catch (e) {
    userId = null;
  }

  const { projects, loading, error, searchTerm, setSearchTerm, sortOption, setSortOption } = useProjects({ userId });

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
