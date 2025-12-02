import { CaseStageStatus, CaseStagesType } from "../../store/Slice/case.slice";
import api from "./axiosInstance";

export class CaseStagesApi {
  static async getStages(caseId: string): Promise<{
    requirementsStage: CaseStagesType;
    documentsStage: CaseStagesType;
    hearingStage: CaseStagesType;
  }> {
    try {
      const res = await api.get(`/api/case/stages/get/${caseId}`);

      if (!res.data.success) throw new Error(res.data.message);

      return res.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async updateStatus(payload: {
    caseId: string;
    stageId: string;
    status: CaseStageStatus;
  }): Promise<{ isAllStageComplete: boolean }> {
    const { caseId, stageId, status } = payload;
    try {
      const res = await api.patch(
        `/api/case/stages/update/status/${caseId}/${stageId}`,
        {
          status,
        }
      );

      if (!res.data.success)
        throw new Error(res.data.message || "Unknown Error");

      return res.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
