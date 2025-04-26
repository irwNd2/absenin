import { Class, Attendance } from '../types/attendance';

export const mockClasses: Class[] = [
  {
    id: 'C001',
    name: 'Class 10A',
    students: [
      { id: 'S001', name: 'John Smith', studentId: 'STD001', class: '10A' },
      { id: 'S002', name: 'Emma Wilson', studentId: 'STD002', class: '10A' },
      { id: 'S003', name: 'Michael Brown', studentId: 'STD003', class: '10A' },
      { id: 'S004', name: 'Sarah Davis', studentId: 'STD004', class: '10A' },
    ],
  },
  {
    id: 'C002',
    name: 'Class 10B',
    students: [
      { id: 'S005', name: 'James Johnson', studentId: 'STD005', class: '10B' },
      { id: 'S006', name: 'Emily White', studentId: 'STD006', class: '10B' },
      { id: 'S007', name: 'Daniel Lee', studentId: 'STD007', class: '10B' },
      { id: 'S008', name: 'Sophia Chen', studentId: 'STD008', class: '10B' },
    ],
  },
];

export const mockAttendance: Attendance[] = [
  {
    id: 'A001',
    teacherId: 'T001',
    subject: 'Physics',
    className: 'Class 10A',
    date: '2024-03-18',
    students: [
      { studentId: 'S001', studentName: 'John Smith', status: 'present' },
      { studentId: 'S002', studentName: 'Emma Wilson', status: 'present' },
      { studentId: 'S003', studentName: 'Michael Brown', status: 'sick' },
      { studentId: 'S004', studentName: 'Sarah Davis', status: 'absent' },
    ],
    createdAt: '2024-03-18T08:00:00Z',
    updatedAt: '2024-03-18T08:00:00Z',
  },
]; 