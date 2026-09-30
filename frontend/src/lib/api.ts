const API_BASE = 'http://localhost:5000/api';

// Helper: get JWT token from localStorage
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

// Helper: make authenticated API requests
async function apiFetch(url: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${url}`, { ...options, headers });

  if (res.status === 401) {
    // Token expired or invalid - redirect to login
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
}

// ===== Auth API =====
export const authApi = {
  login: (email: string, password: string) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  getProfile: () => apiFetch('/auth/profile'),
};

// ===== Leads API =====
export const leadsApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch(`/leads${query}`);
  },

  getById: (id: number) => apiFetch(`/leads/${id}`),

  create: (data: Record<string, unknown>) =>
    apiFetch('/leads', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: number, data: Record<string, unknown>) =>
    apiFetch(`/leads/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  updateStatus: (id: number, status: string) =>
    apiFetch(`/leads/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  delete: (id: number) =>
    apiFetch(`/leads/${id}`, { method: 'DELETE' }),
};

// ===== Notes API =====
export const notesApi = {
  getByLead: (leadId: number) => apiFetch(`/leads/${leadId}/notes`),

  create: (leadId: number, text: string) =>
    apiFetch(`/leads/${leadId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),
};

// ===== Dashboard API =====
export const dashboardApi = {
  getSummary: () => apiFetch('/dashboard/summary'),
};
