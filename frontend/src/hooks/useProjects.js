import { useEffect, useState } from 'react';

export default function useProjects({ userId = null, apiBase = '' } = {}) {
  const [rawProjects, setRawProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Se não tivermos userId válido, não tentamos buscar e mostramos erro para o usuário
    if (!userId) {
      setRawProjects([]);
      setLoading(false);
      setError('Usuário não autenticado. Faça login para ver seus projetos.');
      return;
    }

    setLoading(true);
    const url = `${apiBase}/ada/users/${userId}/projects`;
    // Inclui token de autorização se disponível
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    fetch(url, { headers })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`${res.status} ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        const mapped = (data || []).map(p => ({
          id: p.projectID,
          title: p.name,
          subtitle: p.description,
          // keep ISO date for sorting; meta (display) is derived separately
          submittedAtIso: p.submittedAt
        }));
        setRawProjects(mapped);
      })
      .catch((err) => {
        console.error('Erro ao buscar projetos:', err);
        setError(err.message || 'Erro desconhecido');
      })
      .finally(() => setLoading(false));
  }, [userId, apiBase]);

  useEffect(() => {
    // compute displayed projects with formatted date
    const term = (searchTerm || '').trim().toLowerCase();
    let filtered = rawProjects.filter(p => {
      if (!term) return true;
      return (p.title || '').toLowerCase().includes(term) || (p.subtitle || '').toLowerCase().includes(term);
    });

    if (sortOption === 'recent') {
      filtered = filtered.sort((a, b) => new Date(b.submittedAtIso) - new Date(a.submittedAtIso));
    } else if (sortOption === 'old') {
      filtered = filtered.sort((a, b) => new Date(a.submittedAtIso) - new Date(b.submittedAtIso));
    } else if (sortOption === 'name') {
      filtered = filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    // add meta formatted date
    const withMeta = filtered.map(p => ({
      ...p,
      meta: formatDate(p.submittedAtIso)
    }));

    setProjects(withMeta);
  }, [rawProjects, searchTerm, sortOption]);

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }

  return {
    projects,
    rawProjects,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption
  };
}
