import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getAllClasses } from "@/api/class";
import { Class } from "@/types/Class";

export const useAllClasses = (): UseQueryResult<Class[], Error> => {
  return useQuery<Class[], Error>({
    queryKey: ["AllClasses"],
    queryFn: getAllClasses,
  });
};
