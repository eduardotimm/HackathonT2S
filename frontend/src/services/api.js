const BASE_URL = ''; // O proxy no package.json cuida do resto

async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  // If body is FormData, browsers set the proper Content-Type boundary. Remove any Content-Type header.
  if (options && options.body && options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Erro na API: ${response.status}`);
  }

  // Se a resposta tiver conteúdo, retorna o JSON, senão retorna a resposta crua
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response;
}

export const api = {
  login: (email, password) => apiFetch('/ada/user/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (username, email, password) => apiFetch('/ada/user', { method: 'POST', body: JSON.stringify({ username, email, password }) }),
  createProject: (userId, projectData) => apiFetch(`/ada/users/${userId}/projects`, { method: 'POST', body: JSON.stringify(projectData) }),
  uploadProjectFolder: (userId, formData) => apiFetch(`/ada/users/${userId}/projects/upload`, { method: 'POST', body: formData, headers: { /* let fetch set Content-Type for multipart */ } }),
  // ... você pode adicionar outras chamadas aqui (getProjects, getReports, etc.)
};