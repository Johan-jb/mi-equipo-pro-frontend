import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token enviado en petición a:', config.url);
    } else {
      console.log('⚠️ No hay token para la petición a:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('❌ Error en interceptor de petición:', error);
    return Promise.reject(error);
  }
);

// Interceptor para respuestas (opcional, pero útil para debugging)
api.interceptors.response.use(
  (response) => {
    console.log('✅ Respuesta exitosa de:', response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Error en respuesta de:', error.config?.url);
    console.error('Código:', error.response?.status);
    console.error('Mensaje:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export default api;