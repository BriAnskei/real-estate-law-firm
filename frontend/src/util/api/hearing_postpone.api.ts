import { HearingPostponementsType } from "../../types/HearingPostponementsType";
import api from "./axiosInstance";

export class HearingPostponeApi {
  static async fetchPostponeHistory(
    hearingId: string
  ): Promise<HearingPostponementsType[]> {
    try {
      const res = await api.get(`/api/hearing/postponements/get/${hearingId}`);

      if (!res.data.success)
        throw new Error(res.data.message || "Unknown error");

      return res.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
