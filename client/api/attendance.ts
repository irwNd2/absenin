import axiosInstance from "./axios";

import {
  StudentAttendance,
  AddStudentAttendancePayload,
} from "@/types/Student";

export const getStudentAttendance = async (): Promise<StudentAttendance[]> => {
  const res = await axiosInstance.get<{ data: StudentAttendance[] }>(
    "/attendance/teacher"
  );
  return res.data.data;
};

export const addStudentAttendance = async (
  payload: AddStudentAttendancePayload
) => {
  return await axiosInstance.post("/attendance/add", payload);
};
