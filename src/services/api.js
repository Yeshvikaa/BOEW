import axios from 'axios'

// Force correct production API base
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://boew.onrender.com/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('boew_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('boew_token')
      localStorage.removeItem('boew_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
