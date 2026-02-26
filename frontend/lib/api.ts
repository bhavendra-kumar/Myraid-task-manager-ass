import axios from "axios";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL;
const trimmedBaseUrl = rawBaseUrl?.replace(/\/$/, "");
const baseURL = trimmedBaseUrl
  ? trimmedBaseUrl.endsWith("/api")
    ? trimmedBaseUrl
    : `${trimmedBaseUrl}/api`
  : undefined;

export const api = axios.create({
  baseURL,
  withCredentials: true
});