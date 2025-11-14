import { CaseType } from "../../store/Slice/case.slice";
import { ClientType } from "../../store/Slice/client.slice";
import { ApiResponseType } from "./apiResponseType";
import api from "./axiosInstance";

export class caseApi {
  static async create(payload: {
    caseData: CaseType;
    clientData: ClientType;
  }): Promise<
    ApiResponseType<{ newCaseData: CaseType; newClietData: ClientType }>
  > {
    try {
      const res = await api.post("/api/case/create", payload);
      if (!res.data.success) {
        return { success: false, message: res.data.message };
      }
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  static async getAllUnpaid(): Promise<
    ApiResponseType<{
      page: number;
      totalPages: number;
      data: CaseType[];
      total: number;
    }>
  > {
    try {
      const res = await api.get("/api/case/get/unpaid");

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
