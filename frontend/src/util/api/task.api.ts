import { AxiosResponse } from "axios";
import { TaskFormType } from "../../hooks/case/ongoing/useTaskForm";
import {
  CaseTransactionTask,
  Stages,
  file_type,
} from "../../store/Slice/case.slice";

import api from "./axiosInstance";
import { TaskFileApi } from "./task_file.api";

export class TaskApi {
  static async create(payload: {
    formData: TaskFormType;
    stageName: Stages;
    stageId: string;
    fileForm?: FormData;
  }): Promise<CaseTransactionTask> {
    try {
      const { formData, stageName, stageId, fileForm } = payload;

      const taskApiRes = await api.post(
        `/api/task/create/${stageName}/${stageId}`,
        formData
      );

      const taskData = taskApiRes.data?.data;
      if (!taskApiRes.data?.success || !taskData) {
        throw new Error(taskApiRes.data?.message ?? "Task creation failed.");
      }

      // handles file upload
      if (fileForm) {
        try {
          await TaskFileApi.uploadFiles({
            taskId: taskData.id,
            file_type: file_type.uploader,
            fileForm,
          });
        } catch (error) {
          // delete thee created task once the file upload fails
          await this.RollbackDrop(taskData.id);
        }
      }

      return taskData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * rollback function for files upload failure
   */
  private static async RollbackDrop(id: string): Promise<void> {
    try {
      const res = await api.delete(`api/task/rollback/${id}`);

      if (!res.data.success) throw new Error(res.data.message);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async getById(id: string): Promise<CaseTransactionTask> {
    try {
      const res = await api.get(`/api/task/find/${id}`);

      if (!res.data.success) throw new Error(res.data.message);

      return res.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async getTask(payload: {
    stageId: string;
    stageName: Stages;
  }): Promise<CaseTransactionTask[]> {
    try {
      const { stageId, stageName } = payload;

      const res = await api.get(`/api/task/get/${stageName}/${stageId}`);

      if (!res.data.success) throw new Error(res.data.message);

      return res.data.data;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}
