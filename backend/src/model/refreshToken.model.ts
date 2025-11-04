export interface refreshToken {
  id?: string;
  token: string;
  userId: string;
  rememberMeIssued?: boolean;
  expiresAt: Date;
  createdAt?: Date;
}
