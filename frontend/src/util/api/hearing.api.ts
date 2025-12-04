import { HearingType, HearingStatusType } from "../../types/HearingTypes";
import api from "./axiosInstance";

export class HearingApi {
  /**
   * Create a new hearing for a given case
   */
  static async create(payload: {
    case_id: string;
    hearingData: {
      type: string;
      scheduled_date: string;
    };
  }): Promise<HearingType> {
    try {
      const { case_id, hearingData } = payload;

      const res = await api.post(`/api/hearing/create/${case_id}`, hearingData);

      if (!res.data.success)
        throw new Error(res.data.message || "Failed to fetch hearings");

      return res.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Get all hearings for a specific case
   */
  static async getAll(case_id: string): Promise<HearingType[]> {
    try {
      const res = await api.get(`/api/hearing/get/${case_id}`);

      if (!res.data.success)
        throw new Error(res.data.message || "Failed to fetch hearings");

      return res.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Find a hearing by ID
   */
  static async find(id: string): Promise<HearingType> {
    try {
      const res = await api.get(`/api/hearing/find/${id}`);

      if (!res.data.success) throw new Error(res.data.message);

      return res.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Update a hearing by ID
   */
  static async update(payload: { id: string; newType: string }): Promise<void> {
    try {
      const { id, newType } = payload;

      const res = await api.patch(`/api/hearing/update/${id}`, { newType });

      if (!res.data.success) throw new Error(res.data.message);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Delete a single hearing
   */
  static async delete(id: string): Promise<void> {
    try {
      const res = await api.delete(`/api/hearing/delete/${id}`);

      if (!res.data.success) throw new Error(res.data.message);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Delete all hearings belonging to a case
   */
  static async deleteAll(case_id: string): Promise<void> {
    try {
      const res = await api.delete(`/api/hearing/delete-all/${case_id}`);

      if (!res.data.success) throw new Error(res.data.message);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
