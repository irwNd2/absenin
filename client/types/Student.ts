import { Class } from "./Class";
import { Subject } from "./Subject";

export interface Student {
  id: number;
  name: string;
  email: string;
  updatedAt: string;
  createdAt: string;
  parent: {
    id: number;
    name: string;
    email: string;
    updatedAt: string;
    createdAt: string;
    expo_token: string | null;
  };
  is_checked?: boolean;
}

export interface StudentByClassID {
  id: number;
  name: string;
  nisn: string;
}

export interface StudentAttendance {
  id: number;
  student_class_id: number;
  student_class: Class;
  subject_id: number;
  subject: Subject;
  teacher_id: number;
  time: string;
  student_attendance: any;
}

export interface AddStudentAttendancePayload {
  student_class_id: number;
  subject_id: number;
  teacher_id: number;
  time: string;
}
