import axios from "axios";

export const api = axios.create({
  // Always call same-origin '/api'. Next.js rewrites proxy this to your backend.
  baseURL: "/api",
  withCredentials: true
});