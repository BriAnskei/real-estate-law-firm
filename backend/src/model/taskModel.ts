export type taskModel = {
  id?: string;
  case_stage_id: string;
  stage_name: string;
  tittle: string;
  description: string;
  assign_by: string;
  assign_to: string;
  due_date: string;
  status: "pending" | "rejected" | "approved";
  comments_count?: string;
  created_at?: string;
};

export type TaskType = taskModel & {
  assignee_name: string;
  assigner_name: string;
};
