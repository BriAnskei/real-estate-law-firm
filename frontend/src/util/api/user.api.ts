import { UserType } from "../../store/Slice/userSlice";
import { ApiResponseeType } from "./apiResponseType";
import api from "./axiosInstance";

export class UserApi {
  static async fetchUser(token: string): Promise<ApiResponseeType<UserType>> {
    try {
      const res = await api.get("api/user/current", {
        headers: {
          token,
        },
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
