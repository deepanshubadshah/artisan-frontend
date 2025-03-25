import axios from "axios";
import { toast } from "react-toastify";

// Create an Axios instance with your base URL from environment variables
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
});

// Request interceptor: attach JWT token to each request if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: catch 401 Unauthorized errors (e.g., expired token)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("token");
      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;