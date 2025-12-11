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

export type notificationType =
  | "CASE_CONSULTATION"
  | "ONGOING_CASE"
  | "CASE_COMPLETION"
  | "CASE_STAGE_STATUS"
  | "TASK_RELATED"
  | "ACCOUNTS_RELATED";
