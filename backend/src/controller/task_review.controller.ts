import { Request, Response } from "express";
import { AuthRequest } from "../types/express.types.js";
import { TaskReviewService } from "../service/task_review.service.js";

export class TaskReviewController {
  static async addNewReview(req: AuthRequest, res: Response): Promise<void> {
    const reviewer_id = req.userId;
    const { task_id } = req.params;
    const { comment } = req.body;

    const response = await TaskReviewService.add({
      newReview: {
        task_id,
        reviewer_id: reviewer_id!,
        comment,
      },
    });

    res.json({ success: true, data: response });
  }

  /**
   * Process server task execution function
   * this function sends a notification on assigner only.
   */
  static async executedReview(req: AuthRequest, res: Response): Promise<void> {
    const reviewer_id = req.userId;
    const { task_id } = req.params;
    const { comment } = req.body;

    const response = await TaskReviewService.add({
      newReview: {
        task_id,
        reviewer_id: reviewer_id!,
        comment,
      },
      reviewType: "executed",
    });

    res.json({ success: true, data: response });
  }

  static async fetchAll(req: Request, res: Response): Promise<void> {
    const { task_id } = req.params;

    const response = await TaskReviewService.fetchAllTaskReviews(task_id);
    res.json({ success: true, data: response });
  }

  static async findOne(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const response = await TaskReviewService.findById(id);

    res.json({ ...response });
  }
}
