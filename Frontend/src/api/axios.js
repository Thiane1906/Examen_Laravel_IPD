import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api', // ⚠️ adapte selon ton backend
  withCredentials: true // Nécessaire pour Sanctum
})
export const csrf = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
});

// injecter automatiquement le token dans chaque requête
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export default axiosInstance
    