import axios from 'axios';

const API_BASE = '/api/v1';  // прокси на backend

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Добавляем токен в заголовки, если он есть
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (username, email, password) =>
  api.post('/auth/register', { username, email, password });

export const login = (username, password) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);
  return api.post('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
};

export const getNotes = () => api.get('/notes/');
export const createNote = (title, content) => api.post('/notes/', { title, content });
export const updateNote = (id, title, content) => api.put(`/notes/${id}`, { title, content });
export const deleteNote = (id) => api.delete(`/notes/${id}`);