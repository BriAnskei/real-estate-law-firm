import { ApiResponseType } from "./apiResponseType";
import { CaseStagesType } from "../../store/Slice/case.slice";
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
}
