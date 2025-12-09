export type NotificationType = {
  id?: string;
  user_id?: string;
  type: notificationType;
  related_case_id?: string;
  related_task_id?: string;
  message: string;
  is_read?: boolean;
  created_at?: string;
};

type notificationType =
  | "NEW_CASE"
  | "NEW_TASK"
  | "TASK_COMMENT"
  | "TASK_DUE_SOON"
  | "STAGE_COMPLETED"
  | "CASE_COMPLETED";
