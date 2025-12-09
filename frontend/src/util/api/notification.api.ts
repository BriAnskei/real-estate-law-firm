import { NotificationType } from "../../types/NotificationType";
import api from "./axiosInstance";

export class NotificationApi {
  static async fetchAll(): Promise<NotificationType[]> {
    try {
      const res = await api.get("/api/notification/get");

      if (!res.data.success)
        throw new Error(res.data.message || "Unkown error");
      return res.data.data;
    } catch (error) {
      throw error;
    }
  }
}
