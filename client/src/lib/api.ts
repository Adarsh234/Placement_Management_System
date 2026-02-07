import axios from 'axios'

// Create an Axios instance pointing to your Backend URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Ensure this matches your Server PORT
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor: Automatically attaches the JWT token to every request
API.interceptors.request.use((req) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      req.headers.Authorization = `Bearer ${token}`
    }
  }
  return req
})

export default API
