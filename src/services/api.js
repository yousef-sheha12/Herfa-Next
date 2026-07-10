import axios from "axios";
import { getToken } from "@/lib/authStorage";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith("/auth")) {
        localStorage.removeItem("herfa-auth");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
