import { Roles } from "../store/Slice/userSlice";

export type SessionLogType = {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  role: Roles;
  loginTime: string;
  logoutTime: string | null;
  status: "active" | "ended";
};
