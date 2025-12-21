export interface refreshToken {
  id?: string;
  userId: string;
  session_id?: string;
  token: string;
  rememberMeIssued?: boolean;
  expiresAt: Date;
  createdAt?: Date;
}
