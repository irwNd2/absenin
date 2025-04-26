import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { Attendance } from '../types/attendance';
import {
  getAttendanceByTeacher,
  updateAttendance,
  deleteAttendance,
} from '../services/attendance';
import axios from 'axios';
import { API_URL } from '../config';

interface AttendanceStudent {
  studentId: string;
  status: 'present' | 'sick' | 'absent';
}

interface CreateAttendanceParams {
  teacherId: string;
  subject: string;
  className: string;
  date: string;
  students: AttendanceStudent[];
}

export const useAttendance = () => {
  const { user } = useAuth();
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendances = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getAttendanceByTeacher(user.id);
      setAttendances(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addAttendance = async (params: CreateAttendanceParams) => {
    console.log('Adding attendance:', params);
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        `${API_URL}/api/attendance`,
        params,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      setError('Failed to create attendance');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAttendanceRecord = useCallback(async (id: string, data: {
    students: Array<{
      studentId: string;
      status: 'present' | 'sick' | 'absent';
    }>;
  }) => {
    setLoading(true);
    try {
      const updatedAttendance = await updateAttendance(id, data);
      setAttendances(prev =>
        prev.map(attendance =>
          attendance.id === id ? updatedAttendance : attendance
        )
      );
      setError(null);
      return updatedAttendance;
    } catch (err) {
      setError('Failed to update attendance record');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeAttendance = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await deleteAttendance(id);
      setAttendances(prev => prev.filter(attendance => attendance.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete attendance record');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    attendances,
    loading,
    error,
    fetchAttendances,
    addAttendance,
    updateAttendanceRecord,
    removeAttendance,
  };
}; 