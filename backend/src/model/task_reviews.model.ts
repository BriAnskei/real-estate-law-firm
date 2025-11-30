export type TaskReviewModel = {
  id?: string;
  task_id: string;
  reviewer_id: string;
  comment: string;
  reviewed_at?: string;
};
