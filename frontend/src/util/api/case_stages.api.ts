import {
  CaseStageStatus,
  CaseStagesType,
  Stages,
} from "../../store/Slice/case.slice";
import { HearingType } from "../../types/HearingTypes";
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
    stageName: Stages;
  }): Promise<{ isAllStageComplete: boolean }> {
    const { caseId, stageId, status, stageName } = payload;
    try {
      const res = await api.patch(
        `/api/case/stages/update/status/${caseId}/${stageId}/${stageName}`,
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

  static async setSelectedHearing(paylaod: {
    caseId: string;
    hearing_id: string;
  }): Promise<HearingType> {
    try {
      const { caseId, hearing_id } = paylaod;

      const res = await api.patch(
        `/api/case/stages/selection/hearing/${caseId}`,
        {
          hearing_id,
        }
      );

      if (!res.data.success)
        throw new Error(res.data.message || "Unknown Error");

      return res.data.data.hearingData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
