export type CasesModel = {
  id?: string;
  client_id: string;
  concern: string;
  description: string;
  paid: "no" | "partial" | "paid";
  status: "ongiong" | "complete";
  promise_to_pay: Date;
  created_at?: Date;
};
