import { UserType } from "../../store/Slice/userSlice";
import { ApiResponseType } from "./apiResponseType";
import api from "./axiosInstance";

export class UserApi {
  static async fetchUser(): Promise<ApiResponseType<UserType>> {
    try {
      const res = await api.get("/api/user/current");

      if (!res.data.success) {
        return { success: false, message: res.data.message };
      }

      return res.data;
    } catch (error) {
      throw error;
    }
  }
  static async fetchAll(): Promise<ApiResponseType<UserType>> {
    try {
      const res = await api.get("/api/user/get");

      if (!res.data.success) {
        return { success: false, message: res.data.message };
      }

      return res.data;
    } catch (error) {
      throw error;
    }
  }
  static async filter(filterInput: string): Promise<ApiResponseType<UserType>> {
    try {
      const res = await api.get("/api/user/filter", {
        params: { filterInput },
      });

      if (!res.data.success) {
        return { success: false, message: res.data.message };
      }

      return res.data;
    } catch (error) {
      throw error;
    }
  }
}
