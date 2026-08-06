import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://school-demo-backend.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

//--------------------------------------------------
// Request Interceptor
//--------------------------------------------------

api.interceptors.request.use(

  (config) => {

    const token = localStorage.getItem("token");

    if (token) {

      config.headers.Authorization = `Bearer ${token}`;

    }

    return config;

  },

  (error) => Promise.reject(error)

);

//--------------------------------------------------
// Response Interceptor
//--------------------------------------------------

api.interceptors.response.use(

  (response) => response,

  (error) => {

    console.error("API Error:", error);

    return Promise.reject(error);

  }

);

export default api;
