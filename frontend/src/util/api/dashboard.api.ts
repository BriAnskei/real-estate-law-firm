import {
  AdminDashboardTypes,
  DashboardSummary,
} from "../../context/DashboardContext";
import api from "./axiosInstance";

export class DashboardApi {
  static async fetchAdminDashboard(): Promise<AdminDashboardTypes> {
    try {
      const res = await api.get("/api/dashboard/admin");

      if (!res.data.success) throw new Error(res.data.message);

      return res.data.data;
    } catch (error) {
      throw error;
    }
  }

  static async fetchGlobalDashboard(): Promise<DashboardSummary> {
    try {
      const res = await api.get("/api/dashboard/global");
      console.log("api response: ", res);
      if (!res.data.success) throw new Error(res.data.message);

      return res.data.data;
    } catch (error) {
      throw error;
    }
  }
}
