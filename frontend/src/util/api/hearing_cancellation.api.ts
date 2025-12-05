import { HearingCancellationType } from "../../types/HearingCancellationType";
import api from "./axiosInstance";

export class HearingCancellationApi {
  static async fetchHearingCancellationData(
    hearingId: string
  ): Promise<HearingCancellationType> {
    try {
      const res = await api.get(`/api/hearing/cancellation/find/${hearingId}`);

      if (!res.data.success)
        throw new Error(res.data.message || "Unknown error");

      return res.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
