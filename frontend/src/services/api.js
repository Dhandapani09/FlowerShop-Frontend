import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8080/api";
export const DEMO_MODE = String(import.meta.env.VITE_DEMO_MODE ?? "true") === "true";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fw_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const endpoints = {
  login: "/auth/login",
  dashboard: "/dashboard/summary",
  suppliers: "/suppliers",
  customers: "/customers",
  purchases: "/purchases",
  sales: "/sales",
  ledger: "/ledger",
  payments: "/payments",
  receipts: "/receipts"
};

export async function requestOrDemo(method, path, data, demoValue) {
  if (DEMO_MODE) return demoValue;
  const response = await api.request({ method, url: path, data });
  return response.data;
}
