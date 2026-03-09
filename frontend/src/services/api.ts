import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {

    if (error.response?.status === 401) {

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      window.location.href = '/login';

    }

    return Promise.reject(error);

  }
);

/* AUTH */
export const authService = {

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),

};


/* TICKETS */
export const ticketService = {

  /* role-based tickets */
  getAll: () => api.get('/tickets'),

  /* agent assigned tickets */
  getAssignedTickets: () => api.get('/tickets'),

  create: (data: { title: string; description: string; priority: string }) =>
    api.post('/tickets', data),

  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/tickets/${id}`, data),

  delete: (id: string) =>
    api.delete(`/tickets/${id}`),

};


/* ADMIN */
export const adminService = {

  /* get all tickets (admin only) */
  getAllTickets: () => api.get('/tickets'),

  getUsers: () => api.get('/admin/users'),

  getAgents: () => api.get('/admin/agents'),

  assignTicket: (ticketId: string, agentId: string) =>
    api.put(`/admin/assign/${ticketId}`, { agentId }),

};
export const agentService = {

  getMyTickets: () => api.get("/agent/tickets"),

  updateStatus: (id: string, status: string) =>
    api.put(`/agent/tickets/${id}`, { status }),

};
export default api;