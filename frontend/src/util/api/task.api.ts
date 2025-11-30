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
    case_id: string;
    stage_name: Stages;
    formData: TaskFormType;
    stageId: string;
    fileForm?: FormData;
  }): Promise<CaseTransactionTask> {
    try {
      const { case_id, stage_name, formData, stageId, fileForm } = payload;

      const taskApiRes = await api.post(
        `/api/task/create/${stage_name}/${stageId}`,
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
            file_type: file_type.uploader, // uploader type for task manipulation
            fileForm,
            case_id,
            stage_name,
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

  static async update(payload: {
    case_id: string;
    stage_name: Stages;
    updateForm: FormData;
    task_id: string;
  }): Promise<CaseTransactionTask> {
    try {
      const { case_id, stage_name, updateForm, task_id } = payload;

      const res = await api.patch(
        `/api/task/update/${case_id}/${stage_name}/${task_id}/${file_type.uploader}`,
        updateForm
      );

      if (!res.data.success) throw new Error(res.data.message);

      return res.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async markComplete(task_id: string): Promise<void> {
    try {
      const res = await api.patch(`/api/task/complete/${task_id}`);

      if (!res.data.success) throw new Error(res.data.message);
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

  static async delete(payload: {
    case_id: string;
    stage_name: Stages;

    task_id: string;
  }): Promise<void> {
    const { case_id, stage_name, task_id } = payload;
    try {
      const res = await api.delete(
        `/api/task/delete/${case_id}/${stage_name}/${task_id}/${file_type.uploader}`
      );

      if (!res.data.success) throw new Error(res.data.message);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
