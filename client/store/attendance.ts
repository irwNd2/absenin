import { create } from "zustand";

type StudentAttendanceState = {
  subjectID: number | null;
  classID: number | null;
};

type StudentAttendanceAction = {
  updateSubjectID: (subjectID: StudentAttendanceState["subjectID"]) => void;
  updateClassID: (classID: StudentAttendanceState["classID"]) => void;
};

const useStudentAttendanceStore = create<
  StudentAttendanceState & StudentAttendanceAction
>((set) => ({
  subjectID: null,
  classID: null,
  updateSubjectID: (subjectID: number | null) =>
    set(() => ({ subjectID: subjectID })),
  updateClassID: (classID: number | null) => set(() => ({ classID: classID })),
}));

export default useStudentAttendanceStore;
