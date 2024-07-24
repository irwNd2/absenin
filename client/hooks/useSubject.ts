import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getAllSubject } from "@/api/subject";
import { Subject } from "@/types/Subject";
import QueryKey from "@/constants/QueryKey";

export const useAllSubject = (): UseQueryResult<Subject[], Error> => {
  return useQuery<Subject[], Error>({
    queryKey: [QueryKey.allTeacherSubjects],
    queryFn: getAllSubject,
  });
};
