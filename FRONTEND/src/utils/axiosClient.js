import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://codeorbit-backend-uwtg.onrender.com",
  withCredentials: true,  // sends httpOnly cookies automatically
});

// ── Request interceptor ──────────────────────────────────────────────────────
// The backend reads the JWT from req.cookies.token (httpOnly cookie).
// withCredentials:true tells the browser to include cookies cross-origin,
// so no manual Authorization header is needed.
// This interceptor only adds a safety-net header if a token is also stored
// in localStorage (for environments that don't support httpOnly cookies).
axiosClient.interceptors.request.use(
  (config) => {
    // If the backend ever switches to Bearer tokens, uncomment:
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ─────────────────────────────────────────────────────
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const msg    = error.response?.data || error.message;

    if (status === 401) {
      console.warn("[Auth] 401 Unauthorized — session may have expired.");
    } else {
      console.error(`[API Error ${status}]:`, msg);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;