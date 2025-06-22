import axios from "axios";

const api = axios.create({
  baseURL:  "http://34.79.140.130:3000/",
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