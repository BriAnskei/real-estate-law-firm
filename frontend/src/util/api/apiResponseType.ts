export type ApiResponseeType<T> = {
  success: boolean;
  message?: string;
  data?: T;
};
