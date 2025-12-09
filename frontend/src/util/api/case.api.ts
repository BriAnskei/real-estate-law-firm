import { CaseType } from "../../store/Slice/case.slice";
import { ClientFormType, ClientType } from "../../store/Slice/client.slice";
import { ApiResponseType } from "./apiResponseType";
import api from "./axiosInstance";

export class caseApi {
  static async create(payload: {
    caseData: CaseType;
    clientData: ClientFormType;
  }): Promise<
    ApiResponseType<{ newCaseData: CaseType; newClientData: ClientType }>
  > {
    try {
      const res = await api.post("/api/case/create", payload);

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * fetch active cases
   */
  static async fetchActiveCases(): Promise<ApiResponseType<CaseType[]>> {
    try {
      const res = await api.get("/api/case/get/active");

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch all cases");
      }

      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * cases with status on ongoing or complete
   * amd paid of partial or paid
   */
  static async fetchFilteredActiveCases(payload: {
    query?: string;
    status: "ongoing" | "complete";
  }): Promise<CaseType[]> {
    const { query, status } = payload;
    try {
      const res = await api.get(`/api/case/filter/active`, {
        params: { query, status },
      });

      if (!res.data.success)
        throw new Error(res.data.message || "Unknown error");

      return res.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async filterPayments(payload: {
    query?: string;
    paidType?: string;
  }): Promise<CaseType[]> {
    const { query, paidType } = payload;

    try {
      const res = await api.get(`/api/case/filter/payment`, {
        params: { query, paidType },
      });

      if (!res.data.success)
        throw new Error(res.data.message || "Unknown error");

      return res.data.data;
    } catch (error) {
      throw error;
    }
  }

  static async getAllUnpaid(payload: {
    page?: number;
    filters?: { query?: string; sortFilter?: string };
  }): Promise<
    ApiResponseType<{
      page: number;
      totalPages: number;
      data: CaseType[];
      total: number;
    }>
  > {
    try {
      const { page, filters } = payload;

      const res = await api.get("/api/case/get/unpaid", {
        params: {
          page,
          query: filters?.query,
          sortFilter: filters?.sortFilter,
        },
      });

      if (!res.data.success) {
        return { success: false, message: res.data.message };
      }

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async find(id: string): Promise<CaseType> {
    try {
      const res = await api.get(`/api/case/find/${id}`);

      if (!res.data.success) throw new Error(res.data.message);

      return res.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async findByStageId(case_stage_id: string): Promise<CaseType> {
    try {
      const res = await api.get(`/api/case/find/stage/${case_stage_id}`);

      if (!res.data.success) throw new Error(res.data.message);

      return res.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async update(payload: {
    id: string;
    caseUpdate: Partial<CaseType>;
    clientUpdate: Partial<ClientFormType>;
  }): Promise<ApiResponseType<undefined>> {
    const { id, caseUpdate, clientUpdate } = payload;

    try {
      const res = await api.patch(`/api/case/update/${id}`, {
        caseUpdate,
        clientUpdate,
      });

      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async markAsOngoing(payload: {
    id: string;
    paymentMode: string;
    promiseToPay: string;
  }): Promise<void> {
    try {
      const { id, paymentMode, promiseToPay } = payload;
      const res = await api.patch(`api/case/mark/ongoing/${id}`, {
        paymentMode,
        promiseToPay,
      });
      if (!res.data.success) throw new Error(res.data.message);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async markAsPaid(caseId: string): Promise<void> {
    try {
      const res = await api.patch(`api/case/mark/paid/${caseId}`);

      if (!res.data.success) throw new Error(res.data.message);
    } catch (error) {
      throw error;
    }
  }

  static async delete(id: string): Promise<ApiResponseType<undefined>> {
    try {
      const res = await api.delete(`api/case/delete/${id}`);

      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
