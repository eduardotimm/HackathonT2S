const API_BASE_URL = '/ada'; // Proxy will handle http://localhost:5135

async function apiFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = errorText;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorJson.title || errorText;
    } catch (e) {
      // Not a JSON error, use raw text
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const api = {
  login: async (username, password) => {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' }
    });
  },

  register: async (username, password) => {
    return apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' }
    });
  },

  createProject: async (userId, payload) => {
    return apiFetch(`/users/${userId}/projects`, { method: 'POST', body: JSON.stringify(payload) });
  },

  uploadProjectFolder: async (userId, formData) => {
    return apiFetch(`/users/${userId}/projects/upload`, { method: 'POST', body: formData, headers: {} }); // headers: {} para que o browser defina Content-Type automaticamente para FormData
  },

  getProjectAnalysisDetails: async (projectId) => {
    return apiFetch(`/projects/${projectId}/analysis-details`);
  }
};