export interface registration_request {
  id?: string;
  uid?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "founding-manager/admin" | "lawyer" | "paralegal" | "process-server";
  password_hash?: string;
  provider: "manual" | "google";
}
