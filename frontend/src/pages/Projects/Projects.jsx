import React, { useState, useEffect } from 'react';
import ProjectList from '../../components/ProjectList/ProjectList';
import './Projects.css';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [rawProjects, setRawProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const storedName = typeof window !== 'undefined' ? localStorage.getItem('userName') : null;
  const ownerName = storedName || 'Você';

  useEffect(() => {
    const userId = 1; // TODO: substituir pelo ID do usuário autenticado
    const url = `https://localhost:7135/ada/users/${userId}/projects`;

    fetch(url)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`${res.status} ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        // mapear para o formato esperado pelo ProjectList e manter a data ISO para ordenação
        const mapped = (data || []).map(p => ({
          id: p.projectID,
          title: p.name,
          subtitle: p.description,
          meta: formatDate(p.submittedAt),
          submittedAtIso: p.submittedAt
        }));
        setRawProjects(mapped);
        setProjects(mapped);
      })
      .catch((err) => {
        console.error('Erro ao buscar projetos:', err);
        setError(err.message || 'Erro desconhecido');
      })
      .finally(() => setLoading(false));
  }, []);

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }

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
          (() => {
            // aplicar filtro por nome
            const term = searchTerm.trim().toLowerCase();
            let filtered = rawProjects.filter(p => {
              if (!term) return true;
              return (p.title || '').toLowerCase().includes(term) || (p.subtitle || '').toLowerCase().includes(term);
            });

            // aplicar ordenação
            if (sortOption === 'recent') {
              filtered = filtered.sort((a, b) => new Date(b.submittedAtIso) - new Date(a.submittedAtIso));
            } else if (sortOption === 'old') {
              filtered = filtered.sort((a, b) => new Date(a.submittedAtIso) - new Date(b.submittedAtIso));
            } else if (sortOption === 'name') {
              filtered = filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
            }

            return (
              <ProjectList
                projects={filtered}
                ownerName={ownerName}
                onSearch={(v) => setSearchTerm(v)}
                onSort={(v) => setSortOption(v)}
              />
            );
          })()
        )}
      </div>
    </div>
  );
}
