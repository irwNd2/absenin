import axiosInstance from "./axios";
import { Student, StudentByClassID } from "@/types/Student";

export const getStudentByTeacherID = async (
  teacherID: number
): Promise<Student[]> => {
  const response = await axiosInstance.get<{ data: Student[] }>(
    `/student/all/${teacherID}`
  );
  return response.data.data;
};

export const getStudentByClassID = async (
  classID: number
): Promise<StudentByClassID[]> => {
  const response = await axiosInstance.get<{ data: StudentByClassID[] }>(
    `/student/all/class/${classID}`
  );
  return response.data.data;
};
