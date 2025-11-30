export type TaskReviewType = {
  id?: string;
  task_id: string;
  reviewer_id: string;
  reviewer_fullname: string;
  reviewer_role: string;
  comment: string;
  reviewed_at?: string;
};
