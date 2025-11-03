import { toast } from "sonner";

export const useToast = () => {
  const defaultToast = (message: string) => toast(message);

  const successToast = (message: string) => toast.success(message);

  const infoToast = (message: string) => toast.info(message);

  const warningToast = (message: string) => toast.warning(message);

  const errorToast = (message: string) => toast.error(message);

  const promiseToast = async <T>(
    promise: Promise<T> | (() => Promise<T>),
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: unknown) => string);
    }
  ) => {
    return toast.promise(promise, messages);
  };

  return {
    defaultToast,
    successToast,
    infoToast,
    warningToast,
    errorToast,
    promiseToast,
  };
};
