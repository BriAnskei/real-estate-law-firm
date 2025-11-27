export type TaskFileModel = {
  id?: string;
  task_id: string;
  file_name: string;
  original_name: string;
  file_path: string;
  file_type: "SUBMISSION" | "ASSIGNER_UPLOAD";
  created_at?: string;
};
