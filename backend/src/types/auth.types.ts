export type ResponseType<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

export type SignInPayload = {
  email: string;
  password: string;
  role: "founding-manager/admin" | "lawyer" | "paralegal" | "process-server";
  rememberMe: boolean;
};
