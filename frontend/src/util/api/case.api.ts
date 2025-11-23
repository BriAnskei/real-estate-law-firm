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

  static async getAll(): Promise<ApiResponseType<CaseType[]>> {
    try {
      const res = await api.get("/api/case/get");

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch all cases");
      }

      return res.data;
    } catch (error) {
      console.error(error);
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
