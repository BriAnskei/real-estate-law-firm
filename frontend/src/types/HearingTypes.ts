export type HearingStatusType = "scheduled" | "completed" | "cancelled";

export type HearingType = {
  id?: string;
  case_id: string;
  type: string;
  scheduled_date: string;
  reason?: string;
  status?: HearingStatusType;
  created_at?: string;
};
