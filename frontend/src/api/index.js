import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


export const signup = (data) => api.post("/auth/signup", data);
export const login  = (data) => api.post("/auth/login", data);
export const getMe  = ()     => api.get("/auth/me");


export const getFeed      = (page = 1, limit = 10) => api.get(`/posts?page=${page}&limit=${limit}`);
export const createPost   = (formData) => api.post("/posts", formData); // multipart
export const likePost     = (id)  => api.patch(`/posts/${id}/like`);
export const commentPost  = (id, text) => api.post(`/posts/${id}/comment`, { text });
export const deletePost   = (id)  => api.delete(`/posts/${id}`);

export default api;