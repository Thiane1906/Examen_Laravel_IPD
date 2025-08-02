import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // ⚠️ adapte selon ton backend
  withCredentials: true // Nécessaire pour Sanctum
})

export default axiosInstance
    