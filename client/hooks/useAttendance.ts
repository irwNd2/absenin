import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getStudentAttendance } from "@/api/attendance";
import { StudentAttendance } from "@/types/Student";
import QueryKey from "@/constants/QueryKey";

export const useAttendance = (): UseQueryResult<StudentAttendance[], Error> => {
  return useQuery<StudentAttendance[], Error>({
    queryKey: [QueryKey.allAttendanceByTeacher],
    queryFn: getStudentAttendance,
  });
};
