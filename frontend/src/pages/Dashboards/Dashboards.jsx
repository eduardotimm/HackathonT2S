import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboards.css';

export default function Dashboards() {
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('score'); // Ordenação padrão por pontuação
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRanking() {
      try {
        setLoading(true);
        setError(null);
        // A URL do seu backend. Ajuste a porta se necessário.
        const response = await fetch('http://localhost:5135/ada/projects/ranking');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProjects(data);
      } catch (e) {
        console.error("Falha ao buscar o ranking:", e);
        setError('Não foi possível carregar o ranking. Verifique se o backend está rodando e tente novamente.');
      } finally {
        setLoading(false);
      }
    }

    fetchRanking();
  }, []); // O array vazio garante que a busca só acontece uma vez, quando o componente é montado.

  const filteredAndSorted = useMemo(() => {
    let list = [...projects]; // Cria uma cópia para não modificar o estado original

    // Filtro por busca (query)
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(p => 
        (p.name || '').toLowerCase().includes(q) || 
        (p.userName || '').toLowerCase().includes(q)
      );
    }

    // Ordenação
    if (sort === 'az') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sort === 'new') {
      list.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    } else if (sort === 'old') {
      list.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));
    } else if (sort === 'score') {
      // A ordenação principal por nota já vem do backend, mas garantimos aqui também.
      list.sort((a, b) => b.averageScore - a.averageScore);
    }
    return list;
  }, [projects, query, sort]);

  const handleOpenReport = (projectId) => {
    // Navega para a página de relatório (que podemos criar a seguir)
    navigate(`/report/${projectId}`);
  };

  if (loading) {
    return <div className="dashboards-root"><p>Carregando ranking...</p></div>;
  }
  
  if (error) {
    return <div className="dashboards-root"><p className="dashboards-empty error">{error}</p></div>;
  }

  return (
    <div className="dashboards-root">
      <h1 className="dashboards-title">🏆 Ranking de Projetos</h1>

      <div className="dashboards-controls">
        <input
          className="dashboards-search"
          placeholder="Pesquisar por nome do projeto ou autor"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Pesquisar projetos"
        />

        <select className="dashboards-sort" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Ordenar projetos">
          <option value="score">Melhor Pontuação</option>
          <option value="az">A - Z</option>
          <option value="new">Mais recente</option>
          <option value="old">Mais antigo</option>
        </select>
      </div>

      <div className="dashboards-list">
        {filteredAndSorted.length === 0 ? (
          <p className="dashboards-empty">Nenhum projeto analisado encontrado.</p>
        ) : (
          <table className="ranking-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Projeto</th>
                <th>Autor</th>
                <th className="center-align">Pontuação</th>
                <th className="center-align">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.map((p, index) => (
                <tr key={p.projectID}>
                  <td>{index + 1}</td>
                  <td>{p.name}</td>
                  <td>{p.userName || 'N/A'}</td>
                  <td className="center-align score">{p.averageScore.toFixed(1)}</td>
                  <td className="center-align">
                    <button className="dashboard-open" onClick={() => handleOpenReport(p.projectID)}>
                      Ver Relatório
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
