import { RegistrationType } from "../../hooks/state/accountRequest/useAccountRequest";
import { ApiResponseType } from "./apiResponseType";
import api from "./axiosInstance";

export class RegistrationApi {
  static async fetch(): Promise<ApiResponseType<RegistrationType[]>> {
    try {
      const res = await api.get("/api/registration/get");

      if (!res.data.success) {
        return { success: false, message: res.data.message };
      }

      return { success: true, data: res.data.data };
    } catch (error) {
      throw error;
    }
  }

  static async filter(filterInput: string): Promise<RegistrationType[]> {
    try {
      const res = await api.get("/api/registration/filter", {
        params: { filterInput },
      });

      if (!res.data.success) {
        throw new Error(res.data.message);
      }

      return res.data.data;
    } catch (error) {
      throw error;
    }
  }

  static async approveRegistration(registrationReq: RegistrationType) {
    try {
      const res = await api.post("/api/registration/approve", {
        registrationReq,
      });

      if (!res.data.success) throw new Error(res.data.message);
    } catch (error) {
      throw error;
    }
  }

  static async rejectRegistration(payload: {
    registrationReq: RegistrationType;
    reason: string;
  }) {
    try {
      const res = await api.post("/api/registration/reject", payload);

      if (!res.data.success) throw new Error(res.data.message);
    } catch (error) {
      throw error;
    }
  }
}
