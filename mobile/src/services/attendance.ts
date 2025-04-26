import axios from 'axios';
import { API_URL } from '../config';
import type { Attendance, StudentAttendance } from '../types/attendance';
import { authService } from './auth';

const attendanceApi = axios.create({
  baseURL: `${API_URL}/api/attendance`,
});

// Add request interceptor to include auth token
attendanceApi.interceptors.request.use(
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

export const createAttendance = async (data: {
  teacherId: string;
  subject: string;
  className: string;
  date: string;
  students: Array<{
    studentId: string;
    status: 'present' | 'sick' | 'absent';
  }>;
}) => {
  const response = await attendanceApi.post<Attendance>('', data);
  return response.data;
};

export const getAttendance = async () => {
  const response = await attendanceApi.get<Attendance[]>('');
  return response.data;
};

export const getAttendanceByTeacher = async (teacherId: string) => {
  const response = await attendanceApi.get<Attendance[]>(`/teacher/${teacherId}`);
  return response.data;
};

export const getAttendanceByClass = async (className: string) => {
  const response = await attendanceApi.get<Attendance[]>(`/class/${className}`);
  return response.data;
};

export const updateAttendance = async (id: string, data: {
  students: Array<{
    studentId: string;
    status: 'present' | 'sick' | 'absent';
  }>;
}) => {
  const response = await attendanceApi.put<Attendance>(`/${id}`, data);
  return response.data;
};

export const deleteAttendance = async (id: string) => {
  await attendanceApi.delete(`/${id}`);
}; 