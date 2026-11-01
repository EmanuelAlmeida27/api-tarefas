import axios from 'axios';

const api = axios.create({
  baseURL: '/',
  withCredentials: true, // envia cookies automaticamente (token JWT)
});

export default api;
