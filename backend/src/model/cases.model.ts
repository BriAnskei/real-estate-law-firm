export type CasesModel = {
  id?: string;
  client_id: string;
  client_name: string;
  concern: string;
  description: string;
  paid: "no" | "partial" | "paid";
  status: "ongiong" | "complete";
  consultation_date: Date;
  promise_to_pay: Date;
  created_at?: Date;
};

export type CaseStageModel = {
  id?: string;
  case_id: string;
  stage_name: string;
  stage_status: string;
  create_at?: string;
};
