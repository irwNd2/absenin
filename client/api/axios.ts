import axios from "axios";
const API_URL = process.env.EXPO_PUBLIC_API;

const axiosInstance = axios.create({
  baseURL: `${API_URL}/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
