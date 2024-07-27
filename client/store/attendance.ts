import { create } from "zustand";

export type StudentAttendanceDetail = {
  id: number;
  student_id: number;
  student_attendance_id: number;
  is_present: boolean;
  reason: string | null;
  created_at: string;
  updated_at: string;
};

type StudentAttendanceState = {
  subjectID: number | null;
  classID: number | null;
  studentAttendanceDetails: StudentAttendanceDetail[] | null;
};

type StudentAttendanceAction = {
  updateSubjectID: (subjectID: StudentAttendanceState["subjectID"]) => void;
  updateClassID: (classID: StudentAttendanceState["classID"]) => void;
  updateStudentAttendanceDetail: (
    details: StudentAttendanceState["studentAttendanceDetails"]
  ) => void;
};

const useStudentAttendanceStore = create<
  StudentAttendanceState & StudentAttendanceAction
>((set) => ({
  subjectID: null,
  classID: null,
  studentAttendanceDetails: null,
  updateSubjectID: (subjectID: number | null) =>
    set(() => ({ subjectID: subjectID })),
  updateClassID: (classID: number | null) => set(() => ({ classID: classID })),
  updateStudentAttendanceDetail: (details: StudentAttendanceDetail[] | null) =>
    set(() => ({ studentAttendanceDetails: details })),
}));

export default useStudentAttendanceStore;
