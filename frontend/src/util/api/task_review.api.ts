import { TaskReviewType } from "../../types/TaskReviewType";
import api from "./axiosInstance";

export class TaskReviewApi {
  static async add(payload: {
    task_id: string;
    comment: string;
  }): Promise<TaskReviewType> {
    const { task_id, comment } = payload;

    try {
      const res = await api.post(`/api/task/review/add/${task_id}`, {
        comment,
      });

      if (!res.data.success)
        throw new Error(res.data.message || "Unknown error");

      return res.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async taskExecutedReview(taskId: string): Promise<TaskReviewType> {
    try {
      const res = await api.post(`/api/task/review/executed/${taskId}`, {
        comment:
          "Task executed by the process server. Awaiting assigner review.",
      });

      if (!res.data.success)
        throw new Error(res.data.message || "Unknown error");

      return res.data.data;
    } catch (error) {
      throw error;
    }
  }

  static async getAllByTaskId(taskId: string): Promise<TaskReviewType[]> {
    try {
      const res = await api.get(`/api/task/review/get/${taskId}`);

      if (!res.data.success)
        throw new Error(res.data.message || "Unknown error");

      return res.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async findOne(id: string): Promise<TaskReviewType> {
    try {
      const res = await api.get(`/api/task/review/find/${id}`);

      if (!res.data.success)
        throw new Error(res.data.message || "Unknown error");

      return res.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
