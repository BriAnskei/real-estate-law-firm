import { CaseType } from "../../store/Slice/case.slice";
import { ApiResponseType } from "./apiResponseType";
import api from "./axiosInstance";

export class caseApi {
  static async create(caseData: CaseType): Promise<ApiResponseType<CaseType>> {
    try {
      const res = await api.post("/api/case/create", caseData);
      if (!res.data.success) {
        return { success: false, message: res.data.message };
      }
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  static async getAll(): Promise<ApiResponseType<CaseType>> {
    try {
      const res = await api.get("/api/case/get/all");

      if (!res.data.success) {
        return { success: false, message: res.data.message };
      }

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
