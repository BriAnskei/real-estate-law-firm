import { ClientType } from "../../store/Slice/client.slice";
import { ApiResponseType } from "./apiResponseType";
import api from "./axiosInstance";

export class ClientApi {
  static async findById(id: string): Promise<ApiResponseType<ClientType>> {
    try {
      const res = await api.get(`/api/client/find/${id}`);

      return { ...res.data };
    } catch (error) {
      throw error;
    }
  }

  static async fetch(): Promise<ApiResponseType<ClientType[]>> {
    try {
      const res = await api.get("/api/client/get");

      return res.data;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id: string): Promise<ApiResponseType<ClientType[]>> {
    try {
      const res = await api.delete(`/api/client/delete/${id}`);

      return res.data;
    } catch (error) {
      throw error;
    }
  }
}
