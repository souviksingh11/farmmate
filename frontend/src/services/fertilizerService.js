import api from './authService';

export async function listPlans() {
  const { data } = await api.get('/fertilizer');
  return data;
}

export async function createPlan(payload) {
  const { data } = await api.post('/fertilizer', payload);
  return data;
}


