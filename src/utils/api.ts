// src/utils/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const campaignAPI = {
  createCampaign: (data: any) => api.post('/campaigns', data),
  getCampaigns: () => api.get('/campaigns'),
  getCampaign: (id: string) => api.get(`/campaigns/${id}`),
  updateCampaignFlow: (id: string, data: any) => api.put(`/campaigns/${id}/flow`, data),
  startCampaign: (id: string) => api.post(`/campaigns/${id}/start`),
};