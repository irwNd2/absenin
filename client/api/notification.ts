import axiosInstance from "./axios";
import { SendNotificationPayload } from "@/types/Notification";
import { StudentAttendanceDetailPayload } from "@/types/Class";

export const sendNotification = async (
  payload: StudentAttendanceDetailPayload[]
) => {
  return await axiosInstance.post("/notif/send-notification", payload);
};
