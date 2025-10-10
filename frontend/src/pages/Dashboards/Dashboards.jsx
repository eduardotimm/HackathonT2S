import React from 'react';
import './Dashboards.css';

function loadProjects() {
  try {
    const raw = localStorage.getItem('userProjects');
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function saveProjects(list) {
  try {
    localStorage.setItem('userProjects', JSON.stringify(list));
  } catch (e) {
    // ignore
  }
}

export default function Dashboards() {
  const [projects, setProjects] = React.useState(() => loadProjects());
  const [query, setQuery] = React.useState('');
  const [sort, setSort] = React.useState('az');

  React.useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  // Listen to storage events so the dashboard list updates when other parts
  // of the app (e.g. the Home/OK button) modify `userProjects` in localStorage.
  React.useEffect(() => {
    function onStorage(e) {
      if (e.key === 'userProjects') {
        setProjects(loadProjects());
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const filtered = React.useMemo(() => {
    let list = projects.slice();
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(p => (p.name || '').toLowerCase().includes(q));
    }
    if (sort === 'az') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sort === 'new') {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'old') {
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    return list;
  }, [projects, query, sort]);


  return (
    <div className="dashboards-root">
      <h1 className="dashboards-title">Dashboards</h1>

      <div className="dashboards-controls">
        <input
          className="dashboards-search"
          placeholder="Pesquisar por nome do projeto"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Pesquisar projetos"
        />

        <select className="dashboards-sort" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Ordenar projetos">
          <option value="az">A - Z</option>
          <option value="new">Mais recente</option>
          <option value="old">Mais antigo</option>
        </select>
      </div>

      <div className="dashboards-list">
        {filtered.length === 0 ? (
          <p className="dashboards-empty">Nenhum dashboard salvo.</p>
        ) : (
          filtered.map(p => (
            <div key={p.id} className="dashboard-card">
              <div className="dashboard-card-left">
                <h3 className="dashboard-card-title">{p.name}</h3>
                <p className="dashboard-card-desc">{p.description}</p>
              </div>
              <div className="dashboard-card-right">
                <div className="dashboard-card-date">{new Date(p.createdAt).toLocaleString()}</div>
                <button className="dashboard-open">Abrir</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
