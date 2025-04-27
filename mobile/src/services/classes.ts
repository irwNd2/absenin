import axios from "axios";
import { API_URL } from "../config";
import { authService } from "./auth";
import { Class, Student } from "../types/class";

const classesApi = axios.create({
  baseURL: `${API_URL}/api/classes`,
});

classesApi.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getClasses = async () => {
  const response = await classesApi.get<Class[]>("");
  return response.data;
}

export const getStudentsInClass = async (classId: string) => {
  const response = await classesApi.get<Student[]>(`/${classId}/students`);
  return response.data;
}