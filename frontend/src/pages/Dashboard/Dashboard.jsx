import React from 'react';
import useProjects from '../../hooks/useProjects';
import './Dashboard.css';

export default function Dashboard() {
  // Use mock data from useProjects (userId 1)
  const { projects, loading, error, searchTerm, setSearchTerm, sortOption, setSortOption } = useProjects({ userId: 1 });

  return (
    <div className="dashboard-page">
      <header className="dashboard-hero">
        <h1 className="dashboard-title">Dashboards</h1>
        <p className="dashboard-sub">Visão geral dos dashboards gerados para cada repositório</p>
      </header>

      <div className="dashboard-controls">
        <input
          className="dashboard-search"
          placeholder="Pesquisar repositório..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select className="dashboard-sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="recent">Mais recente</option>
          <option value="old">Mais antigo</option>
          <option value="name">A - Z</option>
        </select>
      </div>

      <div className="dashboard-sections">
        {loading ? (
          <div>Carregando dashboards...</div>
        ) : error ? (
          <div className="dashboard-error">Erro: {error}</div>
        ) : (
          projects.length ? (
            projects.map((p) => (
              <section key={p.id} className="repo-dashboard">
                <div className="repo-header">
                  <h2>{p.title || 'Sem nome'}</h2>
                  <p className="repo-meta">{p.meta || ''}</p>
                </div>
                <div className="repo-dashboards">
                  {/* Placeholder cards for different dashboards per repo */}
                  <div className="dash-card">Qualidade de Código (placeholder)</div>
                  <div className="dash-card">Cobertura (placeholder)</div>
                  <div className="dash-card">Complexidade (placeholder)</div>
                </div>
              </section>
            ))
          ) : (
            <div>Nenhum projeto encontrado</div>
          )
        )}
      </div>
    </div>
  );
}
