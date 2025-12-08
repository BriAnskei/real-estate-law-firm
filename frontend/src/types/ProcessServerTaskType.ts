import { CaseTransactionTask } from "../store/Slice/case.slice";

export type ProcessServerTask = CaseTransactionTask & {
  client_name: string;
  case_concern: string;
};
