export type HearingStatusType = "scheduled" | "cancelled";

export type HearingModel = {
  id?: string;
  case_id: string;
  type: string;
  scheduled_date: string;
  status?: HearingStatusType;
  created_at?: string;
};
