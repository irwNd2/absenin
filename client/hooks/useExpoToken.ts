import { updateExpoToken } from "@/api/expoToken";
import { useMutation } from "@tanstack/react-query";
import { UpdateExpoTokenPayload } from "@/types/ExpoToken";

export const useExpoToken = useMutation({
  mutationFn: (payload: UpdateExpoTokenPayload) => updateExpoToken(payload),
});
