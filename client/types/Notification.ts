export interface SendNotificationPayload {
  to: string | null;
  title: string;
  body: string;
  user_id: string;
}
