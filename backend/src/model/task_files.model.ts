export type TaskFileModel = {
  id?: string;
  task_id: string;
  file_name: string;
  original_name: string;
  file_path: string;
  file_type: FileType;
  created_at?: string;
};

export type FileType = "SUBMISSION" | "ASSIGNER_UPLOAD";
