export type Roles =
  | "founding-manager/admin"
  | "lawyer"
  | "paralegal"
  | "process-server";

export interface registration_request {
  id?: string;
  uid?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Roles;
  password_hash?: string;
  provider: "manual" | "google";
}
