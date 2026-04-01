import api from './axiosConfig';

export const getAdminStats = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const getVendors = async () => {
  const response = await api.get('/admin/vendors');
  return response.data;
};

export const approveVendor = async (vendorId) => {
  const response = await api.put(`/admin/vendor/${vendorId}/approve`);
  return response.data;
};

export const rejectVendor = async (vendorId) => {
  const response = await api.put(`/admin/vendor/${vendorId}/reject`);
  return response.data;
};

export const createService = async (data) => {
  const response = await api.post('/admin/service', data);
  return response.data;
};

export const updateServicePricing = async (data) => {
  const response = await api.put('/admin/service/update', data);
  return response.data;
};