export type Metadata = {
  old_value?: string;
  new_value?: string;
  stage_name?: string;
  task_title?: string;
};

type ActivityType =
  | "case_created"
  | "task_created"
  | "hearing_scheduled"
  | "case_updated"
  | "task_updated"
  | "stage_status_changed"
  | "task_deleted"
  | "hearing_cancelled"
  | "task_completed"
  | "hearing_postponed"
  | "document_uploaded"
  | "comment_added";

export interface CaseLogModel {
  id?: number;
  case_id: number;
  user_id: number;
  type: ActivityType;
  title: string;
  description?: string;
  metadata?: Metadata;
  created_at?: string;
}
