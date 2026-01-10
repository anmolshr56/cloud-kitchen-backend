import axios from "axios";

const api = axios.create({
  baseURL: "https://cloud-kitchen-backend-t7d3.onrender.com/api"
});

export default api;
