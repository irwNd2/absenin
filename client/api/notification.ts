import axiosInstance from "./axios";
import { SendNotificationPayload } from "@/types/Notification";

export const sendNotification = async (payload: SendNotificationPayload[]) => {
  return await axiosInstance.post("/notif/send-notification", payload);
};
