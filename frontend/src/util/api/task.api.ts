import { TaskFormType } from "../../hooks/case/ongoing/useCaseTransaction";
import { CaseTransactionTask, Stages } from "../../store/Slice/case.slice";

import api from "./axiosInstance";

export class TaskApi {
  static async create(payload: {
    formData: TaskFormType;
    stageName: Stages;
    stageId: string;
  }): Promise<CaseTransactionTask> {
    try {
      const { formData, stageName, stageId } = payload;

      const res = await api.post(
        `/api/task/create/${stageName}/${stageId}`,
        formData
      );

      if (!res.data.success) throw new Error(res.data.message);

      return res.data.data;
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
