import { CaseLogType } from "../../types/case_log.type";
import api from "./axiosInstance";

export class CaseLogApi {
  static async fetchAllLogs(caseId: string): Promise<CaseLogType[]> {
    try {
      const res = await api.get(`/api/case/log/get/${caseId}`);

      if (!res.data.success) throw new Error(res.data.message);

      return res.data.data;
    } catch (error) {
      throw error;
    }
  }
}
