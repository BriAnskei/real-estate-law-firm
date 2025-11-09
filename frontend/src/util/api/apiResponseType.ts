export type ApiResponseType<T> = {
  success: boolean;
  message?: string;
  data?: T;
};
