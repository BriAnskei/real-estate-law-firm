import { TaskFilterType } from "../../context/CaseTransactionContext";
import { TaskFormType } from "../../hooks/case/ongoing/useTaskForm";

import {
  CaseTransactionTask,
  Stages,
  file_type,
} from "../../store/Slice/case.slice";
import { ProcessServerTask } from "../../types/ProcessServerTaskType";

import api from "./axiosInstance";
import { TaskFileApi } from "./task_file.api";

export class TaskApi {
  static async create(payload: {
    case_id: string;
    stage_name: Stages;
    formData: TaskFormType;
    stageId: string;
    hearingId?: string;
    fileForm?: FormData;

    assignerName: string;
    case_concern: string;
  }): Promise<CaseTransactionTask> {
    try {
      const {
        case_id,
        stage_name,
        formData,
        stageId,
        fileForm,
        hearingId,
        assignerName,
        case_concern,
      } = payload;

      var taskCreateApi = `/api/task/create/${stage_name}/${stageId}`;

      if (hearingId) taskCreateApi += `/${hearingId}`;

      const taskApiRes = await api.post(taskCreateApi, {
        ...formData,
        assignerName,
        case_concern,
        case_id,
      });

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

  /**
   * Find one with pending status, this only implemented for process server
   */
  static async findOneByProcessServer(
    id: string
  ): Promise<CaseTransactionTask> {
    try {
      const res = await api.get(`/api/task/find/process_server/${id}`);

      if (!res.data.success) throw new Error(res.data.message);

      return res.data.data;
    } catch (error) {
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

  static async getHearingTask(payload: {
    hearing_id: string;
    case_stage_id: string;
  }): Promise<CaseTransactionTask[]> {
    try {
      const { hearing_id, case_stage_id } = payload;
      const res = await api.get(
        `/api/task/get/hearing/${hearing_id}/${case_stage_id}`
      );
      if (!res.data.success) throw new Error(res.data.message);

      return res.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async filterTask(payload: {
    stageId: string;
    hearingId?: string;
    filter: TaskFilterType;
  }): Promise<CaseTransactionTask[]> {
    try {
      const { stageId, hearingId, filter } = payload;
      let apiRoute = `/api/task/filter/${stageId}`;

      if (hearingId) apiRoute += `/hearing/${hearingId}`;

      const res = await api.get(apiRoute, {
        params: { filter },
      });

      if (!res.data.success) throw new Error(res.data.message);

      return res.data.data;
    } catch (error) {
      throw error;
    }
  }

  static async getByProcessServer(
    assignee_id: string
  ): Promise<ProcessServerTask[]> {
    try {
      const res = await api.get(`/api/task/process_server/get/${assignee_id}`);

      return res.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async filterByProcessServer(payload: {
    assignee_id: string;
    query: string;
  }): Promise<ProcessServerTask[]> {
    const { assignee_id, query } = payload;
    try {
      const res = await api.get(
        `/api/task/process_server/search/${assignee_id}`,
        {
          params: {
            query,
          },
        }
      );

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

  static async markComplete(payload: {
    task_id: string;
    case_id: string;
  }): Promise<void> {
    try {
      const { task_id, case_id } = payload;

      const res = await api.patch(`/api/task/complete/${task_id}`, { case_id });

      if (!res.data.success) throw new Error(res.data.message);
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
