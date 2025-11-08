import { useState, useCallback } from "react";
import { RegistrationType } from "../accountRequest/useAccountRequest";
import { RegistrationApi } from "../../../util/api/registration.api";

export const useRejectionModal = (
  promiseToast: <T>(
    promise: Promise<T> | (() => Promise<T>),
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: unknown) => string);
    }
  ) => Promise<
    | (string & {
        unwrap: () => Promise<T>;
      })
    | (number & {
        unwrap: () => Promise<T>;
      })
    | {
        unwrap: () => Promise<T>;
      }
  >
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [registration, setregistration] = useState<
    RegistrationType | undefined
  >(undefined);

  const openModal = useCallback((registrationReq: RegistrationType) => {
    setregistration(registrationReq);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setregistration(undefined);
  }, []);
  const toggleModal = useCallback(() => setIsOpen((prev) => !prev), []);

  const confirmRejection = useCallback(async (reason: string) => {
    if (!registration) return;

    await promiseToast(
      async () => {
        await RegistrationApi.rejectRegistration({
          reason,
          registrationReq: registration,
        });
      },
      {
        loading: "Rejecting registration...",
        success: "Registration rejected successfully.",
        error: (err) =>
          `Failed to reject registration: ${err || "Unknown error"}`,
      }
    );
  }, []);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
    registration,
    confirmRejection,
  };
};
