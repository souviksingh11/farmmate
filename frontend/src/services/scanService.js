import api from './authService';

export async function listScans() {
  const { data } = await api.get('/scans');
  return data;
}

export async function createScan(payload) {
  const { data } = await api.post('/scans', payload);
  return data;
}


