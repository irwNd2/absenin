import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getStudentByTeacherID } from "@/api/studentApi";
import { Student } from "@/types/Student";

export const useStudentsByTeacherID = (
  teacherID: number
): UseQueryResult<Student[], Error> => {
  return useQuery<Student[], Error>({
    queryKey: ["students", teacherID],
    queryFn: () => getStudentByTeacherID(teacherID),
  });
};
