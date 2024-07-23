import axiosInstance from "./axios";

import { Subject } from "@/types/Subject";

export const getAllSubject = async (): Promise<Subject[]> => {
  const response = await axiosInstance.get<{ data: Subject[] }>(
    "/subject/teacher"
  );
  return response.data.data;
};
