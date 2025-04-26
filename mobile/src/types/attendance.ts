export type AttendanceStatus = 'present' | 'sick' | 'absent';

export interface Student {
  id: string;
  name: string;
  status: string;
}

export interface Class {
  id: string;
  name: string;
  students: Student[];
}

export interface StudentAttendance {
  ID: string;
  AttendanceID: string;
  StudentID: string;
  Status: AttendanceStatus;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface Attendance {
  id: string;
  teacherId: string;
  subject: string;
  className: string;
  date: string;
  students: Student[];
  createdAt: string;
  updatedAt: string;
} 