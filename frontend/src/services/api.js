import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api"
});

api.interceptors.request.use((config) => {
  const url = config.url || "";
  const method = (config.method || "get").toLowerCase();
  const needsAdminToken =
    url.startsWith("/admin") ||
    (url.startsWith("/categories") && ["post", "put", "patch", "delete"].includes(method)) ||
    (url.startsWith("/products") &&
      ["post", "put", "patch", "delete"].includes(method) &&
      !url.includes("/reviews")) ||
    (url.startsWith("/orders") && method !== "post" && !url.startsWith("/orders/my")) ||
    (url.startsWith("/payments") && method === "get");
  const token = needsAdminToken
    ? localStorage.getItem("blossomAdminToken")
    : localStorage.getItem("blossomCustomerToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
