import axios, { AxiosHeaders } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
});

// api.interceptors.request.use((config) => {
//   const token = window.localStorage.getItem("token");

//   return {
//     ...config,
//     headers: new AxiosHeaders({
//       ...config.headers,
//       Authorization: `Bearer ${token}`,
//     }),
//   };
// });

export default api;