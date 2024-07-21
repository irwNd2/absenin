import axiosInstance from "./axios";
import { UpdateExpoTokenPayload } from "@/types/ExpoToken";

export const updateExpoToken = async (payload: UpdateExpoTokenPayload) => {
  return await axiosInstance.post("/update-expo-token", payload);
};
