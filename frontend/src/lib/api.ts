import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1",
});

export async function getHealth() {
  const { data } = await axios.get(
    (import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1").replace("/api/v1", "") + "/health"
  );
  return data;
}