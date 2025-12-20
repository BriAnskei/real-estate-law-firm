export type SessionLogModel = {
  id: string;
  userId: string;
  loginTime: Date;
  logoutTime: Date | null;
  status: "active" | "ended";
};
