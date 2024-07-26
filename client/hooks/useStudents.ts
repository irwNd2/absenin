import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getStudentByClassID, getStudentByTeacherID } from "@/api/studentApi";
import { Student, StudentByClassID } from "@/types/Student";
import QueryKey from "@/constants/QueryKey";

export const useStudentsByTeacherID = (
  teacherID: number
): UseQueryResult<Student[], Error> => {
  return useQuery<Student[], Error>({
    queryKey: ["students", teacherID],
    queryFn: () => getStudentByTeacherID(teacherID),
  });
};

export const useStudentsByClassID = (
  classID: number
): UseQueryResult<StudentByClassID[], Error> => {
  return useQuery<StudentByClassID[], Error>({
    queryKey: [QueryKey.allStudentByClassID, classID],
    queryFn: () => getStudentByClassID(classID),
  });
};
