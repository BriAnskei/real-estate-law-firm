import { HearingStatus } from "../../hooks/case/hearing/useHearing";
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

  static async filter(payload: {
    query: string;
    status?: HearingStatus;
  }): Promise<HearingType[]> {
    try {
      const { query, status } = payload;

      const res = await api.get("api/hearing/filter", {
        params: {
          query,
          status,
        },
      });
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

  static async postpone(payload: {
    hearing_id: string;
    old_date: string;
    new_date: string;
    reason: string;
  }): Promise<void> {
    const { hearing_id, old_date, new_date, reason } = payload;
    try {
      const res = await api.patch(`/api/hearing/postpone/${hearing_id}`, {
        old_date,
        new_date,
        reason,
      });

      if (!res.data.success)
        throw new Error(res.data.message || "unknown error");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async cancel(payload: {
    hearing_id: string;
    reason: string;
  }): Promise<void> {
    const { hearing_id, reason } = payload;
    try {
      const res = await api.patch(`/api/hearing/cancel/${hearing_id}`, {
        reason,
      });

      if (!res.data.success)
        throw new Error(res.data.message || "unknown error");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async completed(hearing_id: string): Promise<void> {
    try {
      const res = await api.patch(`/api/hearing/complete/${hearing_id}`);

      if (!res.data.success)
        throw new Error(res.data.message || "unknown error");
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
