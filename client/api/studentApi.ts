import axiosInstance from "./axios";
import { Student } from "@/types/Student";

export const getStudentByTeacherID = async (
  teacherID: number
): Promise<Student[]> => {
  const response = await axiosInstance.get<{ data: Student[] }>(
    `/student/all/${teacherID}`
  );
  return response.data.data;
};
