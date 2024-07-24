import axiosInstance from "./axios";

import { StudentAttendance } from "@/types/Student";

export const getStudentAttendance = async (): Promise<StudentAttendance[]> => {
  const res = await axiosInstance.get<{ data: StudentAttendance[] }>(
    "/attendance/teacher"
  );
  return res.data.data;
};
