const RAW = (import.meta.env.VITE_API_URL as string) || "http://localhost:4000";
export const API_BASE = RAW.replace(/\/$/, "");
