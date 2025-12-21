import { SessionLogType } from "../../types/user_sessionType";
import api from "./axiosInstance";

export class UserSessionApi {
  static async fetch(payload: {
    page?: number;
    limit?: number;
    filters?: {
      query?: string;
      startDate?: string; // yyyy-mm-dd
      endDate?: string; // yyyy-mm-dd
    };
  }): Promise<{
    data: SessionLogType[];
    page: number;
    totalPages: number;
    total: number;
  }> {
    const res = await api.get("/api/user/session/get", {
      params: {
        page: payload.page,
        limit: payload.limit,
        query: payload.filters?.query,
        startDate: payload.filters?.startDate,
        endDate: payload.filters?.endDate,
      },
    });

    if (!res.data?.success) {
      throw new Error(res.data?.message || "Failed to fetch sessions");
    }

    return res.data.data;
  }
}
