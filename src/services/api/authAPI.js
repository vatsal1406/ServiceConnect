import api from './axiosConfig';

export const loginUser = async (data) => {
  const response = await api.post('/auth/login', data, {
    withCredentials: true
  });

  return response.data; // { user, accessToken }
};

export const signupUser = async (data) => {
  const response = await api.post('/auth/signup', data,);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};
