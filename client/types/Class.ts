export interface Class {
  id: number;
  name: string;
}

export interface StudentAttendanceDetailPayload {
  student_id: number;
  student_attendance_id: number;
  is_present: boolean;
  reason: string | null;
}

export interface StudentAttendanceDetail
  extends StudentAttendanceDetailPayload {
  name: string;
  nisn: string;
}