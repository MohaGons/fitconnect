import axios from "axios";

const api = axios.create({
  
  baseURL:  "http://35.240.106.140:3000/",
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