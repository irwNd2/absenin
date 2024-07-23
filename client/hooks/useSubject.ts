import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getAllSubject } from "@/api/subject";
import { Subject } from "@/types/Subject";

export const useAllSubject = (): UseQueryResult<Subject[], Error> => {
  return useQuery<Subject[], Error>({
    queryKey: ["TeacherSubject"],
    queryFn: getAllSubject,
  });
};
