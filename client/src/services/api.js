import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const loginUser = async (data) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const signupUser = async (data) => {
  const response = await api.post('/auth/signup', data);
  return response.data;
};

export const getEmployees = async () => {
  const response = await api.get('/employees');
  return response.data;
};

export const searchEmployees = async (params) => {
  const response = await api.get('/employees/search', { params });
  return response.data;
};

export const addEmployee = async (data) => {
  const response = await api.post('/employees', data);
  return response.data;
};

export const getEmployeeById = async (id) => {
  const response = await api.get(`/employees/${id}`);
  return response.data;
};

export const updateEmployee = async (id, data) => {
  const response = await api.put(`/employees/${id}`, data);
  return response.data;
};

export const deleteEmployee = async (id) => {
  const response = await api.delete(`/employees/${id}`);
  return response.data;
};

export const getAIRecommendation = (employeeId) =>
  api.post('/ai/recommend', { employeeId });

export default api;
