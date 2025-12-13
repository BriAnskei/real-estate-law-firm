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

  static async fetchCloseDue(): Promise<NotificationType[]> {
    try {
      const res = await api.get("/api/notification/due");

      if (!res.data.success)
        throw new Error(res.data.message || "Unkown error");
      return res.data.data;
    } catch (error) {
      throw error;
    }
  }

  static async markAsRead(id: string): Promise<void> {
    try {
      const res = await api.patch(`/api/notification/read/one/${id}`);

      if (!res.data.success)
        throw new Error(res.data.message || "Unkown error");
    } catch (error) {
      throw error;
    }
  }

  static async markAllAsRead(): Promise<void> {
    try {
      const res = await api.patch("/api/notification/read/all");

      if (!res.data.success)
        throw new Error(res.data.message || "Unkown error");
    } catch (error) {
      throw error;
    }
  }
}
