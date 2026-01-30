import api from './authService'; // your axios instance

export async function getAdminOverview() {
  const res = await api.get('/admin/overview');
  return res.data;
}

export async function listAdminUsers() {
  const res = await api.get('/admin/users');
  return res.data;
}

export async function getAdminActivity() {
  const res = await api.get('/admin/activity');
  return res.data;
}

export async function getAdminUserDetails(id) {
  const res = await api.get(`/admin/users/${id}`);
  return res.data;
}
