import axios from "axios";

const api = axios.create({
  baseURL: "https://career-portal-backend-mum1.onrender.com",
});

export default api;