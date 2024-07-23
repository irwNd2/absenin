import axiosInstance from "./axios";
import { Class } from "@/types/Class";

export const getAllClasses = async (): Promise<Class[]> => {
  const response = await axiosInstance.get<{ data: Class[] }>("/class/all");
  return response.data.data;
};
