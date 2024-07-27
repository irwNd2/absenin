export interface SendNotificationPayload {
  to: string | null;
  title: string;
  body: string;
  user_id: string;
}

// export interface SendNotificationPayloadNew {
//   student_id: number;
//   student_attendance_id: number;
//   is_present
// }