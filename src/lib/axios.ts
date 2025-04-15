import axios from "axios"

// Create axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:3005",//process.env.NEXT_PUBLIC_API_URL || "https://cashmere-api.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
  // Importante: abilita la gestione dei cookie
  withCredentials: true,
})

// Rimuovi l'header cache-control che sta causando problemi CORS
api.interceptors.request.use(
  (config) => {
    // Rimuovi l'header cache-control
    if (config.headers && "Cache-Control" in config.headers) {
      delete config.headers["Cache-Control"]
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Log dettagliato dell'errore per debug
    console.error("API Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
      },
    })

    const originalRequest = error.config
    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Redirect to login page or handle session expiration
      // You might want to dispatch a logout action or redirect to login
      //window.location.href = '/login'

      return Promise.reject(error)
    }

    return Promise.reject(error)
  },
)

export default api

